from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from .auth import get_current_user
from ..db.session import SessionDep
from typing import Optional
from src.db.models.users import User, Task, Project, ProjectTasks, Label
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from fastapi import HTTPException, status
from datetime import datetime
from typing import List
from ..redis.redis import get_redis
from fastapi.encoders import jsonable_encoder
from redis.asyncio import Redis
import json
from typing import List

router = APIRouter()

class ProjectCreate(BaseModel):
    name: str
    color: str
    favorite: bool = False
    parent_id: Optional[int] = None

class LabelCreate(BaseModel):
    title: str
    color: Optional[str] = None
    user_id: int

class TaskData(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str
    parent_id: int
    date_at: Optional[str] = None
    time_at: Optional[str] = None

class LabelDTO(BaseModel):
    id: int
    title: str
    color: str
    model_config = ConfigDict(from_attributes=True)

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
    date_at: Optional[str] = None
    time_at: Optional[str] = None

@router.post("/task", status_code=201)
async def create_new_task(task_data: TaskData, sess: SessionDep, current_user: User = Depends(get_current_user)):
    print("data", task_data)
    new_task = Task( title=task_data.title, description=task_data.description, user_id=current_user.id)
    try:
        sess.add(new_task)
        await sess.flush() 
        assignment = ProjectTasks( project_id=task_data.parent_id, task_id=new_task.id, added_at=datetime.utcnow() )
        sess.add(assignment)
        await sess.commit()
        await sess.refresh(new_task)
        return new_task
    except IntegrityError as e:
        await sess.rollback()
        raise HTTPException(status_code=400, detail="Integrity error")
    except Exception as e:
        await sess.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/tasksss/{parent_id}", response_model=List[TaskDTO])
async def get_tasks(parent_id: int, sess: SessionDep, current_user: User = Depends(get_current_user), redis: Redis = Depends(get_redis)):
    cache_key = f"user:{current_user.id}:parent:{parent_id}:tasks"
    cached_projects = await redis.get(cache_key)
    if cached_projects:
        return json.loads(cached_projects)
    query = (select(Task).join(ProjectTasks).where(Task.user_id == current_user.id, ProjectTasks.project_id == parent_id))
    result = await sess.execute(query)
    tasks = result.scalars().all()

    tasks_data = jsonable_encoder(tasks)
    await redis.set(cache_key, json.dumps(tasks_data), ex=3600)
    return tasks
    
@router.patch("/tasks/{id}")
async def complete_task(id: int, sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = select(Task).where(Task.id == id, Task.user_id == current_user.id)
    result = await sess.execute(query)
    task = result.scalar_one_or_none(ProjectTasks).where
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
    cache_key = f"user:{current_user.id}:projects"
    cached_projects = await redis.get(cache_key)
    if cached_projects:
        return json.loads(cached_projects)
    query = select(Project).where(Project.user_id == current_user.id)
    res = await sees.execute(query)
    projects = res.scalars().all()

    projects_data = [
        {"id": p.id, "name": p.name, "color": p.color, "is_favorite": p.favorite, "parent_id": p.parent_id} 
        for p in projects
    ]

    await redis.set(cache_key, json.dumps(projects_data), ex=3600)
    return projects_data

@router.post("/label", response_model=LabelDTO)
async def create_new_label(data: LabelCreate, sess: SessionDep, current_user: User = Depends(get_current_user)):
    new_label = Label(
        title=data.title,
        color=data.color,
        user_id=current_user.id
    )
    try:
        sess.add(new_label)
        await sess.commit()
        await sess.refresh(new_label)
        return new_label
    except IntegrityError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Bed request i dont know why lmao")
    except Exception as e:
        await sess.rollback()
        print(f"Unexpected error: {e}")
        raise HTTPException( status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred on the server" )