import os
from datetime import datetime, timedelta
import secrets
from dotenv import load_dotenv
from pathlib import Path

# Load .env from project root regardless of working directory
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

def generate_verification_token() -> str:
    """Generate a secure random token for email verification."""
    return secrets.token_urlsafe(32)

def get_token_expiry() -> datetime:
    """Get the expiry time for the verification token (24 hours from now)."""
    return datetime.now() + timedelta(hours=24)

async def send_verification_email(email: str, token: str, is_student: bool) -> None:
    """Send a verification email to the user using Gmail API."""
    print(f"📧 Sending verification email to {email} using Gmail API...")
    
    try:
        from .gmail_api_service import send_verification_email_gmail
        await send_verification_email_gmail(email, token, is_student)
        print(f"✅ Verification email sent successfully to {email}")
        return
    except Exception as e:
        print(f"❌ Gmail API failed: {str(e)}")
        raise Exception(f"Failed to send verification email: {str(e)}")

if __name__ == "__main__":
    # Test email configuration
    print("🧪 Testing Gmail API email service...")
    
    # Check if GMAIL_USER is set
    gmail_user = os.getenv('GMAIL_USER')
    if gmail_user:
        print(f"✅ GMAIL_USER configured: {gmail_user}")
    else:
        print("⚠️  GMAIL_USER not set in .env file")
        print("Add this to your .env file:")
        print("GMAIL_USER=your-gmail-address@gmail.com")
    
    # Test sending email
    import asyncio
    test_email = input("Enter email to test (or press Enter to skip): ").strip()
    if test_email:
        asyncio.run(send_verification_email(test_email, "test-token-123", is_student=True))
    else:
        print("Skipping email test.")
