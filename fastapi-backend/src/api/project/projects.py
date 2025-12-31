from fastapi import APIRouter, Depends, HTTPException, status
from .schemas import ProjectCreate, ProjectDTO
from src.db.models.models import User, Project
from sqlalchemy.exc import IntegrityError
from ..auth.auth import get_current_user
from ...db.session import SessionDep
from sqlalchemy import select
from typing import List

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", status_code=201, response_model=ProjectDTO)
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
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Project with name '{project_data.name}' already exists")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Integrity constraint violation")
    except Exception as e:
        await sess.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred on the server")

@router.get("/", response_model_by_alias=List[ProjectDTO])
async def get_projects(sess: SessionDep, current_user: User = Depends(get_current_user)):
    query = select(Project).where(Project.user_id == current_user.id)
    res = await sess.execute(query)
    projects = res.scalars().all()

    projects_data = [
        {"id": p.id, "name": p.name, "color": p.color, "is_favorite": p.favorite, "parent_id": p.parent_id} 
        for p in projects
    ]

    return projects_data