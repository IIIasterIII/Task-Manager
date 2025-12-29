from redis.asyncio import Redis
from datetime import datetime
import json

async def add_active_log(redis: Redis, user_id: int, action: str, target: str):
    log_entry = { "active": action, "target": target, "timestamp": datetime.now().isoformat()}
    key=f"activity_log:{user_id}"
    await redis.lpush(key, json.dumps(log_entry))
    await redis.ltrim(key, 0, 49)