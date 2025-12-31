from ..auth.auth import get_current_user
from fastapi import APIRouter, Depends
from src.db.models.models import User
from ...redis.redis import get_redis
from redis.asyncio import Redis
import json

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/")
async def get_history(current_user: User = Depends(get_current_user), redis: Redis = Depends(get_redis)):
    logs = await redis.lrange(f"activity_log:{current_user.id}", 0, -1)
    return [json.loads(log) for log in logs]