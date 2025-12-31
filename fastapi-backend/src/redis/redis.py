import redis.asyncio as redis
from typing import AsyncGenerator
from dotenv import load_dotenv
import os

load_dotenv(override=True)

class RedisManager:
    def __init__(self):
        self.client = redis.from_url(
            os.getenv("REDIS_URL"),
            decode_responses=True,
            max_connections=10
        )

    async def close_pool(self):
        if self.client:
            await self.client.aclose()

redis_manager = RedisManager()

async def get_redis() -> AsyncGenerator[redis.Redis]:
    yield redis_manager.client