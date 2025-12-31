from src.db.models.models import User, Goal, GoalTask, ChartTask
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from ..auth.auth import get_current_user
from sqlalchemy.orm import selectinload
from .schemas import GoalProgressData
from ...db.session import SessionDep
from ..task.schemas import GoalData
from fastapi.logger import logger
from sqlalchemy import select
from datetime import datetime
from typing import List

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.get("/")
async def get_goals(sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = select(Goal).where(Goal.user_id == current_user.id).options(selectinload(Goal.tasks))
    result = await sess.execute(query)
    goals = result.scalars().unique().all()
    return goals

@router.get("/{goal_id}")
async def get_goal_with_today_progress(goal_id: int, sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = (
        select(Goal)
        .where(Goal.user_id == current_user.id, Goal.id == goal_id)
        .options(
            selectinload(Goal.tasks)
            .selectinload(GoalTask.chart_entries)
        )
    )
    result = await sess.execute(query)
    goal = result.scalars().unique().one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    today_str = datetime.now().strftime("%d/%m/%Y")
    was_modified = False
    for task in goal.tasks:
        today_entry = next((entry for entry in task.chart_entries if entry.date == today_str), None)
        if not today_entry:
            new_chart_entry = ChartTask(id_goal_task=task.id, value=0, date=today_str)
            sess.add(new_chart_entry)
            task.chart_entries.append(new_chart_entry)
            was_modified = True
    
    if was_modified:
        await sess.commit()
        await sess.refresh(goal)
    return goal

@router.post("/")
async def create_goal(data: GoalData, sess: SessionDep, current_user: User = Depends(get_current_user)):
    try:
        db_goal = Goal(title=data.title, description=data.description, is_completed=False, user_id=current_user.id)
        sess.add(db_goal)
        await sess.flush() 

        today_str = datetime.now().strftime("%d/%m/%Y")
        for task_item in data.tasks:
            new_task = GoalTask(
                goal_id=db_goal.id,
                title=task_item.title,
                target=task_item.target,
                color=task_item.color,
                type=task_item.type
            )
            sess.add(new_task)
            await sess.flush()
            new_entry = ChartTask(id_goal_task=new_task.id, value=0, date=today_str)
            sess.add(new_entry)

        await sess.commit()
        final_query = select(Goal).where(Goal.id == db_goal.id).options(selectinload(Goal.tasks).selectinload(GoalTask.chart_entries))
        result = await sess.execute(final_query)
        return result.scalars().unique().one()

    except SQLAlchemyError as e:
        await sess.rollback()
        raise HTTPException(status_code=500, detail="Database integrity error")
    except Exception as e:
        await sess.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/progress")
async def update_goal_progress(data: List[GoalProgressData], sess: SessionDep, current_user: User = Depends(get_current_user)):
    logger.info(f"Received progress update data: {data}")
    updated_entries = []
    for entry in data:
        query = (
            select(ChartTask)
            .join(GoalTask, ChartTask.id_goal_task == GoalTask.id)
            .join(Goal, GoalTask.goal_id == Goal.id)
            .where(
                ChartTask.id == entry.entry_id,
                GoalTask.id == entry.task_id,
                Goal.id == entry.goal_id,
                Goal.user_id == current_user.id
            )
        )
        result = await sess.execute(query)
        char_entry = result.scalar_one_or_none()

        if not char_entry:
            raise HTTPException(status_code=404, detail="Chart entry not found")

        char_entry.value = entry.value
        sess.add(char_entry)
        updated_entries.append(char_entry)

    await sess.commit()
    for char_entry in updated_entries:
        await sess.refresh(char_entry)
    
    return {"success": True, "updated_entries": updated_entries}