from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from .auth import get_current_user
from ..db.session import SessionDep
from typing import Optional
from src.db.models.users import User, Task, Project, ProjectTasks, Goal, GoalTask, ChartTask
from sqlalchemy.exc import IntegrityError
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from datetime import datetime
from typing import List, Optional
from ..redis.redis import get_redis
from fastapi.encoders import jsonable_encoder
from redis.asyncio import Redis
from datetime import date, time
from ..actions.actions import add_active_log
from sqlalchemy.orm import selectinload
from sqlalchemy import select
import json
from typing import Literal
from sqlalchemy import select, func
import enum
import traceback

router = APIRouter()

class ProjectCreate(BaseModel):
    name: str
    color: str
    favorite: bool = False
    parent_id: Optional[int] = None

class TaskPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"

class TaskData(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority
    parent_id: int
    date_at: Optional[date] = None
    time_at: Optional[time] = None

class ProjectDTO(BaseModel):
    id: int
    name: str
    color: str
    favorite: bool
    parent_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

class TaskDTO(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    priority: str
    date_at: Optional[date] = None
    time_at: Optional[date] = None

@router.post("/task", status_code=201)
async def create_new_task(task_data: TaskData, sess: SessionDep, current_user: User = Depends(get_current_user), redis: Redis = Depends(get_redis)):
    print(task_data)
    print("Data!")
    new_task = Task( title=task_data.title, description=task_data.description, priority=task_data.priority, user_id=current_user.id, date_at=task_data.date_at, time_at=task_data.time_at )
    try:
        sess.add(new_task)
        await sess.flush()
        query = select(func.max(ProjectTasks.position)).where( ProjectTasks.project_id == task_data.parent_id )
        result = await sess.execute(query)
        max_pos = result.scalar() or 0.0
        new_pos = max_pos + 1024.0
        assignment = ProjectTasks( project_id=task_data.parent_id, task_id=new_task.id, added_at=datetime.utcnow(), position=new_pos )
        sess.add(assignment)
        await sess.commit()
        await sess.refresh(new_task)
        await add_active_log(redis, current_user.id, "Created", "new task")
        return new_task
    except IntegrityError as e:
        await sess.rollback()
        raise HTTPException(status_code=400, detail="Integrity error")
    except Exception as e:
        await sess.rollback()
        traceback.print_exc() 
        raise HTTPException(
            status_code=500, 
            detail={
                "error": str(e),
                "type": type(e).__name__,
                "trace": traceback.format_exc()
            }
        )
    
class TaskPriorityRequest(BaseModel):
    direction: Literal["up", "down"]

@router.get("/history")
async def get_history(current_user: User = Depends(get_current_user), redis: Redis = Depends(get_redis)):
    logs = await redis.lrange(f"activity_log:{current_user.id}", 0, -1)
    return [json.loads(log) for log in logs]

@router.patch("/tasks/move/{project_id}/{task_id}")
async def move_task(project_id: int, task_id: int, direction: str, sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = select(ProjectTasks).where( ProjectTasks.task_id == task_id, ProjectTasks.project_id == project_id )
    result = await sess.execute(query)
    current_rel = result.scalar_one_or_none()
    current_pos = current_rel.position
    if direction == "up":
        neighbor_query = ( select(ProjectTasks).where(ProjectTasks.project_id == project_id, ProjectTasks.position < current_pos).order_by(ProjectTasks.position.desc()).limit(1) )
    else:
        neighbor_query = ( select(ProjectTasks).where(ProjectTasks.project_id == project_id, ProjectTasks.position > current_pos).order_by(ProjectTasks.position.asc()).limit(1))
    neighbor_result = await sess.execute(neighbor_query)
    neighbor_rel = neighbor_result.scalar_one_or_none()
    if not neighbor_rel:
        return {"message": "We cant do that!"}
    neighbor_pos = neighbor_rel.position
    neighbor_rel.position = current_pos
    current_rel.position = neighbor_pos
    await sess.commit()
    return {"success": True}

@router.get("/tasksss/{parent_id}", response_model=List[TaskDTO])
async def get_tasks(parent_id: int, sess: SessionDep, current_user: User = Depends(get_current_user), redis: Redis = Depends(get_redis)):
    #cache_key = f"user:{current_user.id}:parent:{parent_id}:tasks"
    #cached_projects = await redis.get(cache_key)
    #if cached_projects:
    #    return json.loads(cached_projects)
    query = (select(Task).join(ProjectTasks).where(Task.user_id == current_user.id, ProjectTasks.project_id == parent_id).order_by(ProjectTasks.position.asc()))
    result = await sess.execute(query)
    tasks = result.scalars().all()

    tasks_data = jsonable_encoder(tasks)
    #await redis.set(cache_key, json.dumps(tasks_data), ex=3600)
    return tasks
    
@router.patch("/tasks/{id}")
async def complete_task(id: int, sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = select(Task).where(Task.id == id, Task.user_id == current_user.id)
    result = await sess.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or access denied")
    task.is_completed = not task.is_completed
    try:
        await sess.commit()
        await sess.refresh(task)
        return task
    except Exception as e:
        await sess.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update task status")
    
@router.post("/project", status_code=201, response_model=ProjectDTO)
async def create_new_project(project_data: ProjectCreate, sess: SessionDep, current_user: User = Depends(get_current_user)):
    new_project = Project(
        name=project_data.name,
        color=project_data.color,
        favorite=project_data.favorite,
        parent_id=project_data.parent_id,
        user_id=current_user.id
    )
    try:
        sess.add(new_project)
        await sess.commit()
        await sess.refresh(new_project)
        return new_project
    except IntegrityError as e:
        await sess.rollback()
        if "Duplicate entry" in str(e.orig):
            raise HTTPException( status_code=status.HTTP_400_BAD_REQUEST, detail=f"Project with name '{project_data.name}' already exists" )
        raise HTTPException( status_code=status.HTTP_400_BAD_REQUEST, detail="Integrity constraint violation (check parent_id or user_id)" )
    except Exception as e:
        await sess.rollback()
        print(f"Unexpected error: {e}")
        raise HTTPException( status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred on the server" )
    
@router.get("/projects", response_model_by_alias=List[ProjectDTO])
async def get_projects(sees: SessionDep, current_user: User = Depends(get_current_user), redis: Redis = Depends(get_redis)):
    #cache_key = f"user:{current_user.id}:projects"
    #cached_projects = await redis.get(cache_key)
    #if cached_projects:
    #    return json.loads(cached_projects)
    query = select(Project).where(Project.user_id == current_user.id)
    res = await sees.execute(query)
    projects = res.scalars().all()

    projects_data = [
        {"id": p.id, "name": p.name, "color": p.color, "is_favorite": p.favorite, "parent_id": p.parent_id} 
        for p in projects
    ]

    #await redis.set(cache_key, json.dumps(projects_data), ex=3600)
    return projects_data

@router.delete("/task/{id}")
async def delete_task_by_id(id: int, sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = select(Task).where(Task.user_id == current_user.id, Task.id == id)
    task = sess.execute(query)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    sess.delete(task)
    sess.commit()
    return {"success": True, "message": f"Task {id} deleted successfully"}


@router.patch("/editTask/{id}")
async def update_task( id: int, task_data: dict, sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = select(Task).where(Task.user_id == current_user.id, Task.id == id)
    db_task = sess.exec(query).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task_data.items():
        if hasattr(db_task, key):
            setattr(db_task, key, value)
    sess.add(db_task)
    sess.commit()
    sess.refresh(db_task)
    return {"success": True, "data": db_task}

class GoalTaskData(BaseModel):
    title: str
    color: str
    target: int
    type: str

class GoalData(BaseModel):
    title: str
    description: str
    tasks: List[GoalTaskData]

@router.get("/goals")
async def get_goals(sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = ( select(Goal).where(Goal.user_id == current_user.id).options(selectinload(Goal.tasks)) )
    result = await sess.execute(query)
    goals = result.scalars().unique().all()
    return goals

@router.get("/goal/{goal_id}")
async def get_goal_with_today_progress( goal_id: int, sess: SessionDep, current_user: User = Depends(get_current_user) ):
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
            new_chart_entry = ChartTask(
                id_goal_task=task.id,
                value=0,
                date=today_str
            )
            sess.add(new_chart_entry)
            task.chart_entries.append(new_chart_entry)
            was_modified = True
    if was_modified:
        await sess.commit()
        await sess.refresh(goal)
    return goal

@router.post("/goal")
async def create_goal(data: GoalData, sess: SessionDep, current_user: User = Depends(get_current_user)):
    try:
        db_goal = Goal(
            title=data.title,
            description=data.description,
            is_completed=False,
            user_id=current_user.id
        )
        sess.add(db_goal)
        await sess.flush() 
        for task_item in data.tasks:
            new_task = GoalTask(
                goal_id=db_goal.id,
                title=task_item.title,
                target=task_item.target,
                color=task_item.color,
                type=task_item.type
            )
            sess.add(new_task)
        await sess.commit()
        await sess.refresh(db_goal)
        return {"status": "success", "goal_id": db_goal.id}

    except SQLAlchemyError as e:
        await sess.rollback()
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database integrity error")
    except Exception as e:
        await sess.rollback()
        print(f"General error: {e}")
        raise HTTPException(status_code=500, detail=str(e))