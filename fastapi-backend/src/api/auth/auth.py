from ..shared_logic import log_refresh_token, log_user, create_access_token, decode_token, get_current_user, oauth
from fastapi import Depends, HTTPException, Request, Cookie, APIRouter
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from passlib.context import CryptContext
from sqlalchemy import select
from datetime import datetime, timedelta
from ...db.session import SessionDep
from ...db.models.models import User 
from ...redis.redis import get_redis
from redis.asyncio import Redis
from jose import JWTError
from pydantic import BaseModel
import bcrypt
import base64
import httpx
import uuid
import os

router = APIRouter()

@router.get("/login")
async def login(request: Request):
    request.session.clear()
    request.session["login_redirect"] = os.getenv("FRONTEND_URL")
    redirect_uri = os.getenv("REDIRECT_URL") 
    return await oauth.auth_demo.authorize_redirect(request, prompt="select_account", redirect_uri=redirect_uri)



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
        secure=True, 
        samesite="strict"
    )
    return response



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


class UserData(BaseModel):
    email: str
    username: str
    password: str
    avatar: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    # Превращаем пароль в байты
    pwd_bytes = password.encode('utf-8')
    # Генерируем соль и хешируем
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    # Возвращаем строку для записи в БД
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )



@router.post("/auth/register")
async def register_new_user(data: UserData, sess: SessionDep):
    query = select(User).where(User.email == data.email)
    res = await sess.execute(query)
    existing_user = res.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    header, encoded = data.avatar.split(",", 1)
    image_data = base64.b64decode(encoded)

    file_extension = "png"
    file_name = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join("static", file_name)

    with open(file_path, "wb") as f:
        f.write(image_data)

    base_url = os.getenv("BASE_URL", "http://localhost:8000")
    avatar_url = f"{base_url}/static/{file_name}"
    
    new_user = User(
        email=data.email,
        username=data.username,
        password_hash=get_password_hash(data.password),
        user_pic=avatar_url,
        first_logged_in=datetime.utcnow(),
        last_accessed=datetime.utcnow()
    )
    sess.add(new_user)
    await sess.commit()
    await sess.refresh(new_user)
    return {"status": "user created", "user_id": new_user.id}


class UserDataLogin(BaseModel):
    email: str
    password: str

@router.post("/auth/login")
async def login_user(data: UserDataLogin, sess: SessionDep, request: Request, redis: Redis = Depends(get_redis)):
    query = select(User).where(User.email == data.email)
    res = await sess.execute(query)
    user = res.scalar_one_or_none()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}, 
        expires_delta=timedelta(minutes=30)
    )
    await log_refresh_token(user.id, request, redis)
    response = JSONResponse(content={"status": "logged in"})
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        secure=False, # Для localhost:8000 (HTTP)
        samesite="lax",
        path="/"
    )
    return {"status": "success", "access_token": access_token}