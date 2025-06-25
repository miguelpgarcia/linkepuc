import os
from fastapi_mail import FastMail, ConnectionConfig
from datetime import datetime, timedelta
import secrets
from dotenv import load_dotenv
from pathlib import Path
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests

# Load .env from project root regardless of working directory
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

# Ensure all required environment variables are set
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")

if not all([MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM]):
    raise ValueError("Missing required email configuration. Please set MAIL_USERNAME, MAIL_PASSWORD, and MAIL_FROM in .env file")

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

fastmail = FastMail(conf)

def generate_verification_token() -> str:
    """Generate a secure random token for email verification."""
    return secrets.token_urlsafe(32)

def get_token_expiry() -> datetime:
    """Get the expiry time for the verification token (24 hours from now)."""
    return datetime.now() + timedelta(hours=24)

async def send_verification_email(email: str, token: str, is_student: bool) -> None:
    """Send a verification email to the user."""
    verification_url = f"https://linkepuc.com/verify-email?token={token}"
    user_type = "aluno" if is_student else "professor"
    
    # Use SendGrid API (works perfectly on DigitalOcean)
    print("Sending email using SendGrid API...")
    try:
        await send_email_sendgrid(email, verification_url, user_type)
        print(f"Verification email sent successfully to {email} using SendGrid")
        return
    except Exception as e:
        print(f"SendGrid failed: {str(e)}")
        raise Exception(f"Failed to send verification email: {str(e)}")

async def send_email_basic_smtp(email: str, verification_url: str, user_type: str):
    """Fallback email sending using basic smtplib"""
    import asyncio
    
    def send_sync():
        # Try DigitalOcean-compatible SMTP options
        smtp_options = [
            # Port 2525 - allowed on DigitalOcean for email services
            {"server": "smtp.sendgrid.net", "port": 2525, "use_tls": True},
            {"server": "smtp.mailgun.org", "port": 2525, "use_tls": True},
            # Gmail with port 2525 (might work)
            {"server": "smtp.gmail.com", "port": 2525, "use_tls": True},
            # Standard ports (likely blocked but worth trying)
            {"server": "smtp.gmail.com", "port": 587, "use_tls": True},
            {"server": "smtp.gmail.com", "port": 465, "use_ssl": True},
        ]
        
        for option in smtp_options:
            try:
                print(f"Trying basic SMTP: {option['server']}:{option['port']}")
                
                msg = MIMEMultipart('alternative')
                msg['Subject'] = "Verifique seu email - LinkePuc"
                msg['From'] = MAIL_FROM
                msg['To'] = email
                
                html_body = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="https://i.ibb.co/XZ82w6mP/aa.png"
                                 alt="LinkePuc Logo" 
                                 style="max-width: 200px; height: auto;">
                        </div>
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                            <h2 style="color: #333; margin-bottom: 20px;">Bem-vindo ao LinkePuc!</h2>
                            <p style="color: #666; line-height: 1.6;">Olá! Obrigado por se cadastrar como {user_type} no LinkePuc.</p>
                            <p style="color: #666; line-height: 1.6;">Para ativar sua conta, por favor clique no botão abaixo:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{verification_url}" 
                                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                    Verificar meu email
                                </a>
                            </div>
                            <p style="color: #666; line-height: 1.6; font-size: 0.9em;">Este link expirará em 24 horas.</p>
                            <p style="color: #666; line-height: 1.6; font-size: 0.9em;">Se você não se cadastrou no LinkePuc, por favor ignore este email.</p>
                        </div>
                        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 0.9em;">
                            <p>Atenciosamente,<br>Equipe LinkePuc</p>
                        </div>
                    </body>
                </html>
                """
                
                html_part = MIMEText(html_body, 'html')
                msg.attach(html_part)
                
                if option.get("use_ssl"):
                    server = smtplib.SMTP_SSL(option["server"], option["port"], timeout=10)
                else:
                    server = smtplib.SMTP(option["server"], option["port"], timeout=10)
                    if option.get("use_tls"):
                        server.starttls()
                
                server.login(MAIL_USERNAME, MAIL_PASSWORD)
                server.send_message(msg)
                server.quit()
                
                print(f"Email sent successfully using {option['server']}:{option['port']}")
                return
                
            except Exception as e:
                print(f"Failed with {option['server']}:{option['port']}: {str(e)}")
                continue
        
        raise Exception("All basic SMTP options failed")
    
    # Run the synchronous function in a thread pool
    await asyncio.get_event_loop().run_in_executor(None, send_sync)

async def send_email_sendgrid(email: str, verification_url: str, user_type: str):
    """Send email using SendGrid API (works perfectly on DigitalOcean)"""
    import asyncio
    
    def send_sendgrid():
        sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        if not sendgrid_api_key:
            raise Exception("SENDGRID_API_KEY not found in environment variables")
        
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://i.ibb.co/XZ82w6mP/aa.png"
                         alt="LinkePuc Logo" 
                         style="max-width: 200px; height: auto;">
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                    <h2 style="color: #333; margin-bottom: 20px;">Bem-vindo ao LinkePuc!</h2>
                    <p style="color: #666; line-height: 1.6;">Olá! Obrigado por se cadastrar como {user_type} no LinkePuc.</p>
                    <p style="color: #666; line-height: 1.6;">Para ativar sua conta, por favor clique no botão abaixo:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_url}" 
                           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verificar meu email
                        </a>
                    </div>
                    <p style="color: #666; line-height: 1.6; font-size: 0.9em;">Este link expirará em 24 horas.</p>
                    <p style="color: #666; line-height: 1.6; font-size: 0.9em;">Se você não se cadastrou no LinkePuc, por favor ignore este email.</p>
                </div>
                <div style="text-align: center; margin-top: 30px; color: #666; font-size: 0.9em;">
                    <p>Atenciosamente,<br>Equipe LinkePuc</p>
                </div>
            </body>
        </html>
        """
        
        payload = {
            "personalizations": [{"to": [{"email": email}]}],
            "from": {"email": MAIL_FROM},
            "subject": "Verifique seu email - LinkePuc",
            "content": [{"type": "text/html", "value": html_body}]
        }
        
        headers = {
            "Authorization": f"Bearer {sendgrid_api_key}",
            "Content-Type": "application/json"
        }
        
        print(f"Sending email to {email} via SendGrid API")
        response = requests.post(
            "https://api.sendgrid.com/v3/mail/send",
            headers=headers,
            json=payload,
            timeout=10
        )
        
        if response.status_code == 202:
            print("SendGrid API call successful")
            return
        else:
            raise Exception(f"SendGrid API failed with status {response.status_code}: {response.text}")
    
    # Run the synchronous function in a thread pool
    await asyncio.get_event_loop().run_in_executor(None, send_sendgrid)

if __name__ == "__main__":
    # Test email configuration
    print("Testing email configuration...")
    print(f"MAIL_USERNAME: {MAIL_USERNAME}")
    print(f"MAIL_FROM: {MAIL_FROM}")
    print(f"MAIL_SERVER: {MAIL_SERVER}")
    print(f"MAIL_PORT: {MAIL_PORT}")
    
    # Only run the test if all required variables are set
    if all([MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM]):
        import asyncio
        asyncio.run(send_verification_email("mpgarcia.br@gmail.com", "exemplo-token-123", is_student=True))
    else:
        print("\nError: Missing required email configuration. Please set the following in your .env file:")
        print("MAIL_USERNAME=your_email@gmail.com")
        print("MAIL_PASSWORD=your_app_password")
        print("MAIL_FROM=your_email@gmail.com")
