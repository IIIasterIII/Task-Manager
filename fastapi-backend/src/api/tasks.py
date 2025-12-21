from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from .auth import get_current_user
from ..db.session import SessionDep
from typing import Optional
from src.db.models.users import User, Task, Profile, Project, UserTask, Label, TaskLabel
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from datetime import datetime

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

@router.post("/task", status_code=201)
async def create_new_task(task_data: TaskData, sess: SessionDep, current_user: dict = Depends(get_current_user)):
    new_task = Task( title=task_data.title, description=task_data.description, user_id=current_user["id"])
    try:
        sess.add(new_task)
        await sess.flush() 
        assignment = UserTask( user_id=current_user["id"], task_id=new_task.id, added_at=datetime.utcnow() )
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
    
@router.post("/project", status_code=201, response_model=ProjectDTO)
async def create_new_project(project_data: ProjectCreate, sess: SessionDep, current_user: User = Depends(get_current_user)):
    new_project = Project(
        name=project_data.name,
        color=project_data.color,
        favorite=project_data.favorite,
        parent_id=project_data.parent_id,
        user_id=current_user["id"]
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
    
@router.post("/label", response_model=LabelDTO)
async def create_new_label(data: LabelCreate, sess: SessionDep, current_user: User = Depends(get_current_user)):
    new_label = Label(
        title=data.title,
        color=data.color,
        user_id=current_user["id"]
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