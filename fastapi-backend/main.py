from fastapi import FastAPI
import uvicorn
app = FastAPI()

@app.get("/")
async def home():
    return {"Data": "Hello World!"}

if __name__ == "__main__":
    uvicorn.run(host="localhost", port=8000, reload=True)