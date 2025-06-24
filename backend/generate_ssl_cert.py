#!/usr/bin/env python3
"""
Generate self-signed SSL certificate using Python only (no OpenSSL required)
"""
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import datetime
import ipaddress
import os
from pathlib import Path

def generate_self_signed_cert():
    """Generate self-signed SSL certificate using Python cryptography library"""
    print("🔒 Generating self-signed SSL certificate...")
    
    # Create SSL directory
    ssl_dir = Path("ssl")
    ssl_dir.mkdir(exist_ok=True)
    
    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    
    # Create certificate
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "BR"),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "RJ"),
        x509.NameAttribute(NameOID.LOCALITY_NAME, "Rio de Janeiro"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "LinkePuc"),
        x509.NameAttribute(NameOID.COMMON_NAME, "167.99.145.60"),
    ])
    
    cert = x509.CertificateBuilder().subject_name(
        subject
    ).issuer_name(
        issuer
    ).public_key(
        private_key.public_key()
    ).serial_number(
        x509.random_serial_number()
    ).not_valid_before(
        datetime.datetime.now(datetime.timezone.utc)
    ).not_valid_after(
        datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365)
    ).add_extension(
        x509.SubjectAlternativeName([
            x509.IPAddress(ipaddress.IPv4Address("167.99.145.60")),
            x509.DNSName("localhost"),
        ]),
        critical=False,
    ).sign(private_key, hashes.SHA256())
    
    # Write private key
    with open("ssl/key.pem", "wb") as f:
        f.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ))
    
    # Write certificate
    with open("ssl/cert.pem", "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))
    
    print("✅ Self-signed certificate generated successfully!")
    print("📁 Files created:")
    print(f"  - {ssl_dir}/key.pem (private key)")
    print(f"  - {ssl_dir}/cert.pem (certificate)")
    print()
    print("🔄 Now restart your server with:")
    print("   python main_https.py")

if __name__ == "__main__":
    try:
        generate_self_signed_cert()
    except ImportError:
        print("❌ Error: cryptography library not found")
        print("💡 Install it with: pip install cryptography")
        exit(1) 