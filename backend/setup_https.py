#!/usr/bin/env python3
"""
Script to set up HTTPS for the FastAPI backend
"""
import subprocess
import sys
import os
from pathlib import Path

def generate_self_signed_cert():
    """Generate self-signed certificate for testing"""
    print("🔒 Generating self-signed SSL certificate...")
    
    # Create SSL directory if it doesn't exist
    ssl_dir = Path("ssl")
    ssl_dir.mkdir(exist_ok=True)
    
    # Generate private key
    subprocess.run([
        "openssl", "genrsa", "-out", "ssl/key.pem", "2048"
    ], check=True)
    
    # Generate certificate
    subprocess.run([
        "openssl", "req", "-new", "-x509", "-key", "ssl/key.pem", 
        "-out", "ssl/cert.pem", "-days", "365", "-subj", 
        "/C=BR/ST=RJ/L=Rio/O=LinkePuc/CN=167.99.145.60"
    ], check=True)
    
    print("✅ Self-signed certificate generated!")
    print("📁 Files created:")
    print("  - ssl/key.pem (private key)")
    print("  - ssl/cert.pem (certificate)")
    
def setup_production_https():
    """Instructions for production HTTPS setup"""
    print("🏭 For PRODUCTION HTTPS, you need to:")
    print("1. Install Certbot (Let's Encrypt):")
    print("   sudo apt update && sudo apt install certbot")
    print()
    print("2. Generate certificate:")
    print("   sudo certbot certonly --standalone -d your-domain.com")
    print()
    print("3. Or use nginx as reverse proxy:")
    print("   - Install nginx")
    print("   - Configure SSL with Let's Encrypt")
    print("   - Proxy requests to your FastAPI app")

def update_main_for_https():
    """Update main.py to use HTTPS"""
    print("🔄 To enable HTTPS, update your main.py:")
    print()
    print("Replace the uvicorn.run line with:")
    print("uvicorn.run(app, host='0.0.0.0', port=8000, ssl_keyfile='ssl/key.pem', ssl_certfile='ssl/cert.pem')")

if __name__ == "__main__":
    print("🚀 LinkePuc HTTPS Setup")
    print("=" * 30)
    
    choice = input("Choose setup type:\n1. Self-signed certificate (testing)\n2. Production setup info\nEnter 1 or 2: ")
    
    if choice == "1":
        try:
            generate_self_signed_cert()
            update_main_for_https()
        except subprocess.CalledProcessError:
            print("❌ Error: OpenSSL not found. Please install OpenSSL first.")
            print("On Ubuntu/Debian: sudo apt install openssl")
            print("On Windows: Download from https://slproweb.com/products/Win32OpenSSL.html")
    elif choice == "2":
        setup_production_https()
    else:
        print("Invalid choice. Exiting.")
        sys.exit(1) 