from pydantic import BaseModel, ConfigDict
from typing import Optional, Literal, List
import enum
from datetime import date, time

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
    time_at: Optional[time] = None

class TaskPriorityRequest(BaseModel):
    direction: Literal["up", "down"]

class GoalTaskData(BaseModel):
    title: str
    color: str
    target: int
    type: str

class GoalData(BaseModel):
    title: str
    description: str
    tasks: List[GoalTaskData]

class PriorityUpdate(BaseModel):
    priority: TaskPriority

class PinRequest(BaseModel):
    toPin: bool

class TaskScheduleUpdate(BaseModel):
    date_at: Optional[date] = None
    time_at: Optional[time] = None

class TaskDetailsUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None