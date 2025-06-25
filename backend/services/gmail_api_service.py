import os
import base64
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

# Gmail API scope
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

class GmailAPIService:
    def __init__(self):
        self.service = None
        self.credentials_file = Path(__file__).parent / "gmail_credentials.json"
        self.token_file = Path(__file__).parent / "gmail_token.json"
        
    def authenticate(self):
        """Authenticate with Gmail API"""
        creds = None
        
        # Load existing token
        if self.token_file.exists():
            creds = Credentials.from_authorized_user_file(str(self.token_file), SCOPES)
        
        # If no valid credentials, get new ones
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                try:
                    creds.refresh(Request())
                except Exception as e:
                    print(f"Error refreshing token: {e}")
                    creds = None
            
            if not creds:
                if not self.credentials_file.exists():
                    raise Exception(f"Gmail credentials file not found: {self.credentials_file}")
                
                flow = InstalledAppFlow.from_client_secrets_file(
                    str(self.credentials_file), SCOPES
                )
                creds = flow.run_local_server(port=0)
            
            # Save credentials for next run
            with open(self.token_file, 'w') as token:
                token.write(creds.to_json())
        
        self.service = build('gmail', 'v1', credentials=creds)
        return self.service
    
    def create_message(self, to_email: str, subject: str, html_content: str, from_email: str = None):
        """Create a MIME message for Gmail API"""
        if not from_email:
            from_email = os.getenv('GMAIL_USER', 'your-email@gmail.com')
        
        message = MIMEMultipart('alternative')
        message['to'] = to_email
        message['from'] = from_email
        message['subject'] = subject
        
        # Add HTML content
        html_part = MIMEText(html_content, 'html')
        message.attach(html_part)
        
        # Encode message
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        return {'raw': raw_message}
    
    def send_email(self, to_email: str, subject: str, html_content: str, from_email: str = None):
        """Send email using Gmail API"""
        try:
            if not self.service:
                self.authenticate()
            
            message = self.create_message(to_email, subject, html_content, from_email)
            
            result = self.service.users().messages().send(
                userId='me', 
                body=message
            ).execute()
            
            print(f"✅ Gmail API: Email sent successfully to {to_email}")
            print(f"📧 Message ID: {result['id']}")
            return result
            
        except Exception as e:
            print(f"❌ Gmail API error: {str(e)}")
            raise Exception(f"Failed to send email via Gmail API: {str(e)}")

# Global instance
gmail_service = GmailAPIService()

async def send_verification_email_gmail(email: str, token: str, is_student: bool) -> None:
    """Send verification email using Gmail API"""
    import asyncio
    
    def send_gmail():
        verification_url = f"https://linkepuc.com/verify-email?token={token}"
        user_type = "aluno" if is_student else "professor"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://linkepuc.com/lovable-uploads/600b30a3-851a-493b-98ca-81653ff0f5bc.png"
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
        
        gmail_service.send_email(
            to_email=email,
            subject="Verifique seu email - LinkePuc",
            html_content=html_content
        )
    
    # Run in thread pool to keep it async
    await asyncio.get_event_loop().run_in_executor(None, send_gmail)

if __name__ == "__main__":
    # Test the Gmail API
    import asyncio
    
    async def test():
        test_email = input("Enter email to test: ")
        await send_verification_email_gmail(test_email, "test-token-123", True)
    
    asyncio.run(test()) 