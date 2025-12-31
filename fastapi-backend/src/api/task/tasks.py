from src.db.models.models import User, Task, ProjectTasks
from ...redis.actions import add_active_log
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from ..auth.auth import get_current_user
from fastapi import APIRouter, Depends
from ...redis.redis import get_redis
from ...db.session import SessionDep
from sqlalchemy import select, func
from redis.asyncio import Redis
from datetime import datetime
from sqlalchemy import select
from .schemas import *
import traceback

router = APIRouter(tags=["Tasks"])

@router.delete("/tasks/{id}/delete")
async def delete_task_by_id(id: int, sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = select(Task).where(Task.user_id == current_user.id, Task.id == id)
    result = await sess.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await sess.delete(task)
    await sess.commit()
    return {"success": True}



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



@router.patch("/tasks/move/{project_id}/{task_id}")
async def move_task(project_id: int, task_id: int, data: TaskPriorityRequest, sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = select(ProjectTasks).where( ProjectTasks.task_id == task_id, ProjectTasks.project_id == project_id )
    result = await sess.execute(query)
    current_rel = result.scalar_one_or_none()
    current_pos = current_rel.position
    move_direction = data.direction
    if move_direction == "up":
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
    query = (select(Task).join(ProjectTasks).where(Task.user_id == current_user.id, ProjectTasks.project_id == parent_id).order_by(ProjectTasks.position.asc()))
    result = await sess.execute(query)
    tasks = result.scalars().all()
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



@router.patch("/tasks/{task_id}/priority")
async def patch_task_priority( data: PriorityUpdate, task_id: int, sess: SessionDep, current_user: User = Depends(get_current_user) ):
    query = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    res = await sess.execute(query)
    task = res.scalar()
    if not task:
        raise HTTPException( status_code=status.HTTP_404_NOT_FOUND, detail="Task not found" )
    task.priority = data.priority
    sess.add(task)
    await sess.commit()
    await sess.refresh(task)
    return task



@router.patch("/tasks/{task_id}/pin")
async def toggle_pin_task(task_id: int, request: PinRequest, current_user: User = Depends(get_current_user), redis: Redis = Depends(get_redis) ):
    redis_key = f"user_pins:{current_user.id}"
    if request.toPin:
        await redis.sadd(redis_key, task_id)
        message = "Task pinned"
    else:
        await redis.srem(redis_key, task_id)
        message = "Task unpinned"
    return {"success": True, "message": message, "is_pinned": request.toPin}



@router.get("/tasks/pinned")
async def get_pinned_tasks( current_user: User = Depends(get_current_user), redis: Redis = Depends(get_redis) ):
    redis_key = f"user_pins:{current_user.id}"
    pinned_ids = await redis.smembers(redis_key)
    pinned_ids = [int(id) for id in pinned_ids]
    print(pinned_ids)
    return {"pinned_ids": pinned_ids}



@router.patch("/tasks/{task_id}/schedule")
async def patch_task_schedule( task_id: int, data: TaskScheduleUpdate, sess: SessionDep, current_user: User = Depends(get_current_user) ):
    query = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    result = await sess.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.date_at = data.date_at
    task.time_at = data.time_at
    sess.add(task)
    await sess.commit()
    await sess.refresh(task)
    return { "success": True, "date_at": task.date_at, "time_at": task.time_at }



@router.patch("/tasks/{task_id}/details")
async def patch_task_details( task_id: int, data: TaskDetailsUpdate, sess: SessionDep, current_user: User = Depends(get_current_user) ):
    query = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    res = await sess.execute(query)
    task = res.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    sess.add(task)
    await sess.commit()
    await sess.refresh(task)
    return {"success": True, "task": task}