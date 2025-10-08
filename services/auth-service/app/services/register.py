from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.db.models import VerificationCode
import hashlib

def save_verification_code(db: Session, email: str, code: str):
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
    verification_code = VerificationCode(email=email, codigo=code, expiracion=expires_at)
    db.add(verification_code)
    db.commit()

def verify_code(db: Session, email: str, code: str) -> bool:
    verification_code = db.query(VerificationCode).filter_by(email=email, codigo=code).first()
    if verification_code and verification_code.expiracion > datetime.now(timezone.utc):
        db.delete(verification_code)
        db.commit()
        return True
    return False

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()