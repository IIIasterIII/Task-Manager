from fastapi import FastAPI
from src.db.session import init_models
import uvicorn
app = FastAPI()

@app.get("/")
async def home():
    return {"Data": "Hello World!"}

@app.on_event("startup")
async def on_startup():
    await init_models()

if __name__ == "__main__":
    uvicorn.run(host="localhost", port=8000, reload=True)