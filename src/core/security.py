from pwdlib import PasswordHash
import secrets 
from datetime import datetime, timedelta, timezone
import jwt
from src.config.settings import settings

password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"

def hash_otp(otp: str) -> str:
    return password_hash.hash(otp)

def verify_otp(otp: str, hashed_otp: str) -> bool:
    return password_hash.verify(otp, hashed_otp)

def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)

def create_access_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

    payload = {
        "sub": str(user_id),
        "exp": expires_at,
        "iat": datetime.now(timezone.utc),
        "type": "access"
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm="HS256"
    )