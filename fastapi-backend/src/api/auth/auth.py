from ..shared_logic import log_refresh_token, log_user, create_access_token, decode_token, get_current_user, oauth
from fastapi import Depends, HTTPException, Request, Cookie, APIRouter
from fastapi.responses import RedirectResponse, JSONResponse
from datetime import datetime, timedelta
from ...db.session import SessionDep
from ...db.models.models import User 
from ...redis.redis import get_redis
from redis.asyncio import Redis
from jose import JWTError
import os
import httpx

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