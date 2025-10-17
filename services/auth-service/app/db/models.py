# app/db/models.py

from sqlalchemy import Column, Integer, String, DateTime, func
from .session import Base
from pydantic import BaseModel, EmailStr
from typing import Optional

class EmailCheckRequest(BaseModel):
    email: EmailStr

class EmailVerificationRequest(BaseModel):
    email: EmailStr
    code: str

class UserRegistrationRequest(BaseModel):
    name: str
    last_name: Optional[str] = None
    email: EmailStr
    password: Optional[str] = None
    provider: str = "local"
    # Se eliminan los campos no relacionados a la autenticación

class User(Base):
    __tablename__ = 'usuario'

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True, nullable=False)
    apellido = Column(String, index=True, nullable=True)
    correo = Column(String, unique=True, index=True, nullable=False)
    contraseña = Column(String, nullable=True)
    proveedor = Column(String, nullable=True, default='local')
    id_proveedor = Column(String, nullable=True, unique=True)
    rol = Column(String, nullable=False, default='user')
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    # Se eliminan relaciones y campos que irán en otros servicios

class VerificationCode(Base):
    __tablename__ = 'codigos'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    codigo = Column(String, nullable=False)
    expiracion = Column(DateTime(timezone=True), nullable=False)

class LoginRequest(BaseModel):
    email: EmailStr
    password: Optional[str] = None
    name: Optional[str] = None

class SocialLoginRequest(BaseModel):
    name: str
    email: EmailStr
    provider: str
    provider_id: str
    
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str