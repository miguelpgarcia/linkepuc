from fastapi import FastAPI
import uvicorn


print("aa")
app = FastAPI()

@app.get("/")
async def hello_world():
    return {"message": "Hello World"} 

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)