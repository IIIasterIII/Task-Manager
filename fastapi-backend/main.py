from src.api.project.projects import router as ProjectRouter
from starlette.middleware.sessions import SessionMiddleware
from src.api.history.history import router as HistoryRouter
from src.api.goal.goals import router as GoalRouter
from src.api.task.tasks import router as TaskRouter
from fastapi.middleware.cors import CORSMiddleware
from src.api.auth.auth import router as AuthRouter
from fastapi.staticfiles import StaticFiles
from src.db.session import init_models
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi import Request
import uvicorn
import os
import time

load_dotenv()
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(SessionMiddleware, secret_key=os.getenv("FASTAPI_SECRET_KEY"))
app.include_router(AuthRouter)
app.include_router(TaskRouter)
app.include_router(GoalRouter)
app.include_router(HistoryRouter)
app.include_router(ProjectRouter)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("FRONTEND_URL_CORS"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to initialize database models (Not for production use)
@app.on_event("startup")
async def on_startup():
    await init_models()

# Middleware to log processing time for each request 
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