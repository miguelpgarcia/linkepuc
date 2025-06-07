import imaplib
import email
from email.header import decode_header
from email.utils import parseaddr
import os
from dotenv import load_dotenv
from pathlib import Path
import time
import random
from datetime import datetime

from dataclasses import dataclass
from typing import Optional
from openai import OpenAI
import json
from sqlalchemy.orm import Session
from controllers.user_controller import user_router
from controllers.interesse_controller import interesse_router
from controllers.vaga_controller import vaga_router
from controllers.interesse_usuario_controller import interesse_usuario_router
from controllers.publicacao_controller import publicacao_router
from controllers.department_controller import departamento_router
from repositories.department_repository import get_department_id_by_name
from models.base import Base, engine
from repositories.vaga_repository import create_vaga
import re

from models.tipo_vaga import Tipo
from difflib import get_close_matches

@dataclass
class AcademicOpportunity:
    titulo: str
    descricao: str
    professor: Optional[str]
    link_para_vaga: Optional[str]
    remuneracao: Optional[str]
    horas_complementares: Optional[str]
    desconto: Optional[str]
    tipo: str
    prazo: Optional[str]


# Load .env from project root regardless of working directory
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

def get_closest_tipo_id(db: Session, tipo_name: str) -> int:
    tipos = db.query(Tipo).all()
    tipo_names = [tipo.nome for tipo in tipos]
    closest_match = get_close_matches(tipo_name, tipo_names, n=1, cutoff=0.6)
    if closest_match:
        matched_tipo = next((tipo for tipo in tipos if tipo.nome == closest_match[0]), None)
        return matched_tipo.id if matched_tipo else None
    return None

def process_academic_opportunity(db: Session, opportunity: AcademicOpportunity):
    autor_id = 6 # Default author id for email opportunities di
    tipo_id = get_closest_tipo_id(db, opportunity.tipo)
    if not tipo_id:
        print(f"❗ No matching tipo found for '{opportunity.tipo}'. Skipping opportunity.")
        return

    interesses = []
    location_id = 1
    department_id = 1
    remuneracao = int(opportunity.remuneracao) if opportunity.remuneracao else 0
    horas_complementares = int(opportunity.horas_complementares) if opportunity.horas_complementares else 0
    desconto = int(opportunity.desconto) if opportunity.desconto else 0

    vaga = create_vaga(
        db=db,
        titulo=opportunity.titulo,
        descricao=opportunity.descricao,
        prazo=opportunity.prazo,
        autor_id=autor_id,
        interesses=interesses,
        location_id=location_id,
        department_id=department_id,
        remuneracao=remuneracao,
        horas_complementares=horas_complementares,
        desconto=desconto,
        tipo_id=tipo_id,
        link_vaga=opportunity.link_para_vaga,
        professor=opportunity.professor
    )
    print(f"✅ Opportunity '{vaga.titulo}' added to the database.")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def is_academic_opportunity(body: str) -> bool:
    prompt = f"""Sua tarefa é identificar se esse email é sobre uma oportunidade academica que conta como experiencia para o aluno?
        Oportunidades academicas incluem estagios, monitorias, laboratorios, iniciacao cientifica, bolsas, equipes de competicao, empresas juniores e outras experiencias que contam como horas complementares ou desconto na mensalidade ou remuneracao.
        Elas NÃO são eventos, de um dia apenas, como palestras ou workshops. Palestras, Bancas, Defesas e Workshops não contam como oportunidades academicas pois são eventos de um dia apenas.
        Answer only 'yes' or 'no'.\n{body}
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    answer = response.choices[0].message.content.strip().lower()
    return "yes" in answer

def extract_opportunity(body: str) -> Optional[AcademicOpportunity]:
    prompt = f"""
Extract the following information from the academic opportunity email below. 
If something is missing, use null. Return it as JSON with these exact keys:

- titulo (Obrigatório) (Titulo da Oportunidade, caso não encontre, crie ele a partir da descrição)
- descricao (Obrigatório) (Descrição da Oportunidade)
- professor (Professor Responsável)
- link_para_vaga (Link para a Vaga, caso haja) (Em formato https://www.)
- remuneracao (Remuneração em reais, caso haja) (Não por virgulas, apenas o valor inteiro como int) 
- horas_complementares (Horas Complementares em horas, caso haja)(Não por virgulas, apenas o valor inteiro como int)
- desconto (Desconto da mensalidade caso haja)(Não por virgulas, apenas o valor inteiro como int)
- tipo (Obrigatório) (Tipo da Oportunidade: Estágio, Monitoria, Laboratório, Iniciação Científica, Bolsa, Equipe de Competição, Empresa Júnior, etc.)
- prazo (Prazo para inscrição, caso haja, em formato YYYY-MM-DD)
Email:
{body[:2000]}
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    content = response.choices[0].message.content.strip()

    # Remove Markdown code block if present
    if content.startswith("```"):
        content = content.split("```")[1]  # Get the part after the first ```
        # Remove optional 'json' language marker
        if content.strip().startswith("json"):
            content = content.strip()[4:]
        content = content.strip()
    try:
        data = json.loads(content)
        return AcademicOpportunity(**data)
    except Exception as e:
        print("❗ Failed to parse JSON:", e)
        print("🔍 Raw content:", content)
        return None

# Helper to decode MIME headers (e.g., =?UTF-8?...?=)
def decode_mime_words(header_val):
    if not header_val:
        return ""
    decoded_parts = decode_header(header_val)
    return ''.join(
        part.decode(encoding or 'utf-8') if isinstance(part, bytes) else part
        for part, encoding in decoded_parts
    )

from models.base import Base, engine

# Initialize database
Base.metadata.create_all(bind=engine)

from models.base import SessionLocal
def extract_links(text: str) -> list[str]:
    # Regex to match URLs (http, https, www)
    url_pattern = r'(https?://[^\s]+|www\.[^\s]+)'
    return re.findall(url_pattern, text)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db = next(get_db())


username = os.getenv("USERNAME_MAIL")
password = os.getenv("PASSWORD_MAIL")
if not username or not password:
    raise ValueError("Username and password must be set in environment variables.")
# Connect to the server
print("Using username:", username)
print("Using password:", "*" * len(password))  # Mask password length
imap = imaplib.IMAP4_SSL("mail.grad.inf.puc-rio.br", 993)
imap.login(username, password)
imap.select("INBOX")

# Search for all emails
status, messages = imap.search(None, 'SINCE', '01-Jan-2025', 'BEFORE', '01-Jan-2026')
email_ids = messages[0].split()

if not email_ids:
    print("No emails found.")
else:
    # Fetch the latest email
    for email_id in email_ids:
        print("Email ID:", email_id.decode())

        email_id_int = int(email_id.decode())
        print(type(email_id_int))


        status, msg_data = imap.fetch(email_id, "(RFC822)")
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                if msg.is_multipart():
                    total_link = ""
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_dispo = str(part.get("Content-Disposition"))

                        # Check if it's an attachment
                        if "attachment" in content_dispo:
                            link_vaga = ""
                            filename = part.get_filename()
                            if filename:
                                print(f"Found attachment: {filename}")
                                attachment_bytes = part.get_payload(decode=True)

                                # Attempt to decode the attachment content
                                try:
                                    charset = part.get_content_charset() or "utf-8"
                                    attachment_content = attachment_bytes.decode(charset, errors="replace")
                                except Exception as e:
                                    print(f"❗ Failed to decode attachment {filename}: {e}")
                                    attachment_content = ""

                                # Extract links from the attachment content
                                links_in_attachment = extract_links(attachment_content)
                                if links_in_attachment:
                                    print(f"Links found in attachment {filename}: {links_in_attachment}")
                                    # Use the first link found in the attachment if no link is in the body
                                    if not link_vaga and links_in_attachment:
                                        for link in links_in_attachment:
                                            link_vaga = link_vaga + link if link_vaga else link
                                        total_link = total_link + link_vaga if total_link else link_vaga

                # Decode subject and from
                subject = decode_mime_words(msg["Subject"])
                from_name, from_email = parseaddr(msg["From"])
                from_name = decode_mime_words(from_name)


                date_obj = datetime.strptime(msg["Date"], "%a, %d %b %Y %H:%M:%S %z")

                # Filter by year
                if date_obj.year != 2025:
                    continue
                print("Subject:", subject)
                print("From:", f"{from_name} <{from_email}>")
                print("Date:", msg["Date"])
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_dispo = str(part.get("Content-Disposition"))

                        if content_type == "text/plain" and "attachment" not in content_dispo:
                            body_bytes = part.get_payload(decode=True)
                            charset = part.get_content_charset() or "utf-8"
                            body = body_bytes.decode(charset, errors="replace")
                            break
                else:
                    body = msg.get_payload(decode=True).decode(msg.get_content_charset() or "utf-8", errors="replace")

                print("Body preview:")
                print(body[:500])  # Print only the first 500 characters for brevity
                
                if is_academic_opportunity(body):
                    final_body = body + "Links de anexos: " + total_link if total_link else body
                    opportunity = extract_opportunity(final_body)
                    if opportunity:
                        print("📩 Academic opportunity found!")
                        print(opportunity)
                        process_academic_opportunity(db, opportunity)
                    else:
                        print("❗Failed to parse academic opportunity.")
                else:
                    print("📨 Not an academic opportunity.")                
                
                time.sleep(1)
imap.logout()

