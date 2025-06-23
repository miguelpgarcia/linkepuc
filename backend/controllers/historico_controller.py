from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from dependecies import get_current_user
from models.base import SessionLocal

from repositories.historico_repository import create_historico, get_historico_by_user, has_historico, delete_historico_by_user
from models.historico import Historico
from models.user import User
import pdfplumber


historico_router = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Função para separar o código da disciplina e o nome de forma robusta
def separar_codigo_nome(disciplina_str):
    # Verifica se existe o caractere ' - ' para separação
    if ' - ' in disciplina_str:
        return disciplina_str.split(' - ', 1)
    else:
        # Tenta separar no primeiro espaço como fallback, supondo que o código tenha letras e números
        for i, char in enumerate(disciplina_str):
            if char == '-':
                return disciplina_str[:i].strip(), disciplina_str[i+1:].strip()
        # Se tudo falhar, retorna a string como nome sem código (caso especial)
        return '', disciplina_str.strip()





def process_historico_pdf(file: UploadFile) -> list[dict]:
    """
    Process the uploaded PDF and extract historico data.
    """
    data = []
    current_period = None
    try:
# Open the PDF file
        with pdfplumber.open(file.file) as pdf:
            # Iterate over each page in the PDF
            for page in pdf.pages:
                # Extract the table on the page
                tables = page.extract_tables()
                for table in tables:
                    for row in table:
                        if row[0] and row[0].startswith("20"):  # Supondo que o 'Período' comece com ano (ex: 20212)
                            current_period = row[0]  # Armazena o novo período
                            codigo_disciplina, nome_disciplina = separar_codigo_nome(row[1])
                            turma = row[2]
                            grau = row[3]
                            situacao = row[4]
                            n_cred = row[7]
                            # Adiciona a linha na lista
                            data.append([current_period, codigo_disciplina, nome_disciplina, turma, grau, situacao, n_cred])
                        # Verifica se é uma linha de disciplina sem período (período já registrado)
                        elif row[0] == '' and current_period:
                            codigo_disciplina, nome_disciplina = separar_codigo_nome(row[1])
                            turma = row[2]
                            grau = row[3]
                            situacao = row[4]
                            n_cred = row[7]
                            # Adiciona a linha na lista com o período atual
                            data.append([current_period, codigo_disciplina, nome_disciplina, turma, grau, situacao, n_cred])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    return data

@historico_router.post("/upload")
async def upload_historico(file: UploadFile = File(...), current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Upload and process a historico escolar PDF.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")


    historico_data = process_historico_pdf(file)
    if has_historico(db, current_user.id):
        delete_historico_by_user(db, current_user.id)
    create_historico(db, current_user.id, historico_data)
    return {"message": "Historico uploaded and processed successfully."}

@historico_router.get("/status")
async def get_historico_status(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Check if the authenticated user has uploaded their historico.
    """
    has_curriculum = has_historico(db, current_user.id)
    
    # Get the most recent historico entry to determine upload date
    upload_date = None
    if has_curriculum:
        # Get the first historico entry (they're all uploaded at the same time)
        first_entry = db.query(Historico).filter(Historico.user_id == current_user.id).first()
        if first_entry:
            upload_date = first_entry.id  # Using ID as a proxy for upload order/date
    
    return {
        "has_curriculum": has_curriculum,
        "upload_date": upload_date
    }

@historico_router.get("/")
async def get_user_historico(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieve the historico for the authenticated user.
    """
    historico = get_historico_by_user(db, current_user.id)
    return historico