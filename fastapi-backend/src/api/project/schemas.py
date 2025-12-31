from pydantic import BaseModel, ConfigDict
from typing import Optional

class ProjectCreate(BaseModel):
    name: str
    color: str
    favorite: bool = False
    parent_id: Optional[int] = None


class ProjectDTO(BaseModel):
    id: int
    name: str
    color: str
    favorite: bool
    parent_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)