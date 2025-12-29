from fastapi import Cookie, HTTPException, status, Request
from authlib.integrations.starlette_client import OAuth
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
from ..db.session import AsyncSession
from ..db.session import SessionDep
from ..db.models.models import User
from dotenv import load_dotenv
from datetime import datetime
from sqlalchemy import select
from redis import Redis
import json
import uuid
import os

load_dotenv(override=True)

oauth = OAuth()
oauth.register(
    name="auth_demo",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={"scope": "openid profile email"},
)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str, ignore_expiration: bool = False):
    options = {"verify_exp": not ignore_expiration}
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options=options)

async def log_user( db: AsyncSession, user_email, username, user_pic, first_logged_in, last_accessed ):
    result = await db.execute(select(User).filter(User.email == user_email))
    user = result.scalars().first()
    if not user:
        user = User( email=user_email, username=username, user_pic=user_pic, first_logged_in=first_logged_in, last_accessed=last_accessed )
        db.add(user)
        await db.flush()
    else:
        user.last_accessed = last_accessed
    await db.refresh(user)
    await db.commit()
    return user.id

async def log_refresh_token(id: str, request: Request, redis: Redis):
    token_id = str(uuid.uuid4())
    device = request.headers.get("user-agent", "unknown")
    ip = request.headers.get("x-forwarded-for", request.client.host)
    created_at = datetime.utcnow().isoformat()
    token_data = { "token_id": token_id, "device": device, "ip": ip, "created_at": created_at }
    await redis.set(f"refresh_user:{id}", json.dumps(token_data), ex=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60)

async def get_current_user(access_token: str = Cookie(None), sess: SessionDep = None):
    if not access_token:
        raise HTTPException( status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated" )
    try:
        payload = decode_token(access_token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    query = select(User).where(User.id == int(user_id))
    result = await sess.execute(query)
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user