from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.user_controller import user_router
from controllers.interesse_controller import interesse_router
from controllers.vaga_controller import vaga_router
from controllers.interesse_usuario_controller import interesse_usuario_router
from controllers.publicacao_controller import publicacao_router
from controllers.department_controller import departamento_router
from controllers.historico_controller import historico_router
from controllers.mensagem_controller import mensagem_router
from models.base import Base, engine
from controllers.candidato_vaga_controller import candidato_vaga_router
from controllers.recommendation_controller import recommendation_router
import os
from pathlib import Path

# Initialize database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:8080", 
        "http://localhost:4173",
        "https://miguelpgarcia.github.io",
        "http://linkepuc.com",
        "https://linkepuc.com"
    ],  # Frontend URLs
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
app.include_router(mensagem_router, prefix="/mensagens", tags=["Mensagens"])
app.include_router(candidato_vaga_router, prefix="/api/candidaturas", tags=["candidaturas"])
app.include_router(recommendation_router, prefix="/recomendacoes", tags=["Recomendacoes"])

@app.get("/")
async def hello_world():
    return {"message": "Welcome to LinkePuc API"}

if __name__ == "__main__":
    import uvicorn
    
    # Check if SSL certificates exist
    ssl_key = Path("ssl/key.pem")
    ssl_cert = Path("ssl/cert.pem")
    
    if ssl_key.exists() and ssl_cert.exists():
        print("🔒 Starting server with HTTPS (SSL certificates found)")
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=8000,
            ssl_keyfile=str(ssl_key),
            ssl_certfile=str(ssl_cert)
        )
    else:
        print("⚠️  Starting server with HTTP (no SSL certificates found)")
        print("💡 To enable HTTPS, run: python setup_https.py")
        uvicorn.run(app, host="0.0.0.0", port=8000) 