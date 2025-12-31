from pydantic import validator, BaseModel
from datetime import datetime

class GoalProgressData(BaseModel):
    goal_id: int
    task_id: int
    value: int
    entry_id: int
    date: str

    @validator('date')
    def validate_date(cls, v):
        try:
            datetime.strptime(v, "%d/%m/%Y")
        except ValueError:
            raise ValueError("Date must be in DD/MM/YYYY format")
        return v