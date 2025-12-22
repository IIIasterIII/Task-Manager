from fastapi import Depends, HTTPException, Request, Cookie, APIRouter, status
from authlib.integrations.starlette_client import OAuth
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
from ..db.session import SessionDep, AsyncSession
from ..db.models.users import User 
from fastapi.responses import RedirectResponse, JSONResponse
from ..redis.redis import get_redis
from redis.asyncio import Redis
from dotenv import load_dotenv
from sqlalchemy import select
import json
import uuid
import os
import httpx

load_dotenv(override=True)
router = APIRouter()
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

@router.get("/login")
async def login(request: Request):
    request.session.clear()
    request.session["login_redirect"] = os.getenv("FRONTEND_URL")
    redirect_uri = os.getenv("REDIRECT_URL") 
    return await oauth.auth_demo.authorize_redirect(request, redirect_uri=redirect_uri)

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

@router.get("/auth")
async def auth(request: Request, db: SessionDep, redis: Redis = Depends(get_redis)):
    try:
        token = await oauth.auth_demo.authorize_access_token(request)
        user_info = token.get("userinfo")
        if not user_info:
            async with httpx.AsyncClient() as client:
                resp = await client.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={"Authorization": f"Bearer {token['access_token']}"})
                user_info = resp.json()
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Google auth failed: {str(e)}")
    user_email = user_info.get("email")
    id_internal = await log_user(
        db, 
        user_email, 
        user_info.get("name"), 
        user_info.get("picture"), 
        datetime.utcnow(), 
        datetime.utcnow()
    )
    access_token = create_access_token(
        data={"sub": str(id_internal), "email": user_email}, 
        expires_delta=timedelta(minutes=30)
    )
    await log_refresh_token(id_internal, request, redis)
    response = RedirectResponse(url=request.session.pop("login_redirect", os.getenv("FRONTEND_URL")))
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        secure=False, 
        samesite="lax"
    )
    return response

async def get_current_user(access_token: str = Cookie(None), sess: SessionDep = None):
    print(access_token)
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

@router.post("/me")
async def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/refresh")
async def refresh_token(access_token: str = Cookie(None), redis: Redis = Depends(get_redis)):
    if not access_token:
        raise HTTPException(status_code=401, detail="No access token")
    try:
        payload = decode_token(access_token, ignore_expiration=True)
        id = payload.get("sub")
        email = payload.get("email")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    refresh_data = await redis.get(f"refresh_user:{id}")
    if not refresh_data:
        raise HTTPException(status_code=401, detail="Session expired in redis")
    new_access_token = create_access_token(
        data={"sub": id, "email": email},
        expires_delta=timedelta(minutes=30)
    )
    response = JSONResponse(content={"status": "refreshed"})
    response.set_cookie(
        key="access_token", 
        value=new_access_token,
        httponly=True, 
        secure=False,
        samesite="lax"
    )
    return response