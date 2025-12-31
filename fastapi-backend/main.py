from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from src.api.auth.auth import router as AuthRouter
from src.api.task.tasks import router as TaskRouter
from src.db.session import init_models
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
import uvicorn
import os
from fastapi import Request
import time

load_dotenv()
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(SessionMiddleware, secret_key=os.getenv("FASTAPI_SECRET_KEY"))
app.include_router(AuthRouter)
app.include_router(TaskRouter)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Только так!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"Data": "Hello World!"}

@app.on_event("startup")
async def on_startup():
    await init_models()

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    print(f"Path: {request.url.path}, Time: {process_time:.4f} sec")
    return response

if __name__ == "__main__":
    uvicorn.run(host="localhost", port=8000, reload=True)