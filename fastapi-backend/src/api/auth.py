from fastapi import Depends, HTTPException, status, Request, Cookie, APIRouter
from authlib.integrations.starlette_client import OAuth
from jose import jwt, ExpiredSignatureError, JWTError
from ..db.session import SessionDep, AsyncSession
from ..db.models.users import User, IssuedToken
from fastapi.responses import RedirectResponse
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import select
import traceback
import httpx
import uuid
import os

load_dotenv(override=True)
router = APIRouter()

oauth = OAuth()
oauth.register(
    name="auth_demo",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    refresh_token_url=None,
    authorize_state=os.getenv("SECRET_KEY"),
    redirect_uri=os.getenv("REDIRECT_URL"),
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    client_kwargs={"scope": "openid profile email"},
)

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

def create_access_token( data: dict, expires_delta: timedelta = None ):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user( token: str = Cookie(None) ):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"user_id": payload.get("sub"), "email": payload.get("email")}
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@router.get("/login")
async def login(request: Request):
    request.session.clear()
    request.session["login_redirect"] = os.getenv("FRONTEND_URL")
    redirect_uri = os.getenv("REDIRECT_URL") 
    return await oauth.auth_demo.authorize_redirect(request, redirect_uri=redirect_uri)

async def log_user( db: AsyncSession, user_email, username, user_pic, first_logged_in, last_accessed ):
    result = await db.execute(select(User).filter(User.email_id == user_email))
    user = result.scalars().first()
    if not user:
        user = User( email_id=user_email, username=username, user_pic=user_pic, first_logged_in=first_logged_in, last_accessed=last_accessed )
    else:
        user.last_accessed = last_accessed
    await db.refresh(user)
    await db.commit()
    return user.user_id

async def log_token(session: AsyncSession, access_token, user_email, session_id):
    token = IssuedToken( token=access_token, email_id=user_email, session_id=session_id, )
    session.add(token)
    await session.commit()

@router.get("/auth")
async def auth(request: Request, db: SessionDep):
    try:
        token = await oauth.auth_demo.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Google authentication failed.{e}")

    try:
        user_info_endpoint = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f'Bearer {token["access_token"]}'}
        async with httpx.AsyncClient() as client:
            google_response = await client.get(user_info_endpoint, headers=headers)
            user_info = google_response.json()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    user = token.get("userinfo")
    expires_in = token.get("expires_in")
    user_id = user.get("sub")
    iss = user.get("iss")
    user_email = user.get("email")
    first_logged_in = datetime.utcnow()
    last_accessed = datetime.utcnow()
    username = user_info.get("name")
    user_pic = user_info.get("picture")

    if iss not in ["https://accounts.google.com", "accounts.google.com"]:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    if user_id is None:
        raise HTTPException(status_code=401, detail="Google authentication failed.")

    access_token_expires = timedelta(seconds=expires_in)
    session_id = str(uuid.uuid4())
    user_id = await log_user(db, user_email, username, user_pic, first_logged_in, last_accessed)
    access_token = create_access_token(data={"sub": user_id, "email": user_email}, expires_delta=access_token_expires)
    await log_token(db, access_token, user_email, session_id)

    redirect_url = request.session.pop("login_redirect", "")
    response = RedirectResponse(redirect_url)
    response.set_cookie( key="access_token", value=access_token, httponly=True, secure=True, samesite="strict" )
    return response

def get_current_user(token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    credentials_exception = HTTPException( status_code=401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"} )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        user_email: str = payload.get("email")

        if user_id is None or user_email is None:
            raise credentials_exception
        return {"user_id": user_id, "user_email": user_email}

    except ExpiredSignatureError:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired. Please login again.")
    except JWTError:
        traceback.print_exc()
        raise credentials_exception
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=401, detail="Not Authenticated")

def validate_user_request(token: str = Cookie(None)):
    session_details = get_current_user(token)
    return session_details

@router.get("/chat")
async def get_response(current_user: dict = Depends(get_current_user)):
    return {"message": "Welcome!", "user": current_user}