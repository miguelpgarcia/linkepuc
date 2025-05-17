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
import openai
import json


# Load .env from project root regardless of working directory
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)


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

client = openai.OpenAI()

def is_academic_opportunity(body: str) -> bool:
    prompt = f"Is the following email about an academic opportunity? Answer only 'yes' or 'no'.\n\n{body[:1000]}"
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

- titulo
- descricao
- professor
- link_para_vaga
- remuneracao
- horas_complementares
- desconto
- tipo

Email:
{body[:2000]}
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    content = response.choices[0].message.content.strip()
    
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
        status, msg_data = imap.fetch(email_id, "(RFC822)")

        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])

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
                    opportunity = extract_opportunity(body)
                    if opportunity:
                        print("🎓 Academic Opportunity Found:")
                        print(opportunity)
                    else:
                        print("❗Failed to parse academic opportunity.")
                else:
                    print("📨 Not an academic opportunity.")
                time_to_sleep = random.randint(1, 5)
                time.sleep(time_to_sleep)
imap.logout()
