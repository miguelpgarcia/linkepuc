from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.user_controller import user_router
from controllers.interesse_controller import interesse_router
from controllers.vaga_controller import vaga_router
from controllers.interesse_usuario_controller import interesse_usuario_router
from controllers.publicacao_controller import publicacao_router
from controllers.department_controller import departamento_router
from controllers.historico_controller import historico_router
from models.base import Base, engine

# Initialize database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(interesse_router, prefix="/interesses", tags=["Interesses"])
app.include_router(vaga_router, prefix="/vagas", tags=["Vagas"])
app.include_router(interesse_usuario_router, prefix="/interesse-usuario", tags=["InteresseUsuario"])
app.include_router(publicacao_router, prefix="/publicacoes", tags=["Publicacoes"])
app.include_router(departamento_router, prefix="/departamentos", tags=["Departamentos"])
app.include_router(historico_router, prefix="/historicos", tags=["Historicos"])

@app.get("/")
async def hello_world():
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)