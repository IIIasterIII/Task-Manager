from starlette.middleware.sessions import SessionMiddleware
from src.api.auth import router as AuthRouter
from src.db.session import init_models
from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn
import os

load_dotenv()
app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.getenv("FASTAPI_SECRET_KEY"))
app.include_router(AuthRouter)

@app.get("/")
async def home():
    return {"Data": "Hello World!"}

@app.on_event("startup")
async def on_startup():
    await init_models()

if __name__ == "__main__":
    uvicorn.run(host="localhost", port=8000, reload=True)