from fastapi import FastAPI

print("aa")
app = FastAPI()

@app.get("/")
async def hello_world():
    return {"message": "Hello Worldkadonoadooashduoasd"} 