# app/api/endpoints.py

import jwt
import os
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi_mail import MessageSchema
from sqlalchemy.orm import Session
import httpx

from app.core.email import fastmail
from app.db.session import get_db
from app.services.register import save_verification_code, verify_code, get_password_hash
from app.services.login import create_access_token, decode_access_token, verify_password
from app.db.models import (
    EmailVerificationRequest, UserRegistrationRequest, User, EmailCheckRequest,
    LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
)

router = APIRouter()

USER_SERVICE_URL = "http://127.0.0.1:8004"
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
FRONTEND_URL = os.getenv("FRONTEND_URL")

@router.post("/check-email")
async def check_email(request: EmailCheckRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(correo=request.email).first()
    return {"status": "success", "exists": user is not None}

@router.post("/send-verification")
async def send_verification_email(request: EmailVerificationRequest, db: Session = Depends(get_db)):
    try:
        save_verification_code(db, request.email, request.code)
        message = MessageSchema(
            subject="Verificación de Correo - RETOFIT",
            recipients=[request.email],
            body=f"Tu código de verificación es: {request.code}",
            subtype="html"
        )
        await fastmail.send_message(message)
        return {"status": "success", "message": "Código de verificación enviado"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar el email: {str(e)}")

@router.post("/verify-code")
async def verify_code_endpoint(request: EmailVerificationRequest, db: Session = Depends(get_db)):
    if verify_code(db, request.email, request.code):
        access_token = create_access_token(data={"sub": request.email})
        return {"status": "success", "access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=400, detail="Código de verificación incorrecto o expirado")

@router.post("/register")
async def register_user(request: UserRegistrationRequest, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(request.password) if request.password else None
    user = User(
        nombre=request.name,
        apellido=request.last_name or '',
        correo=request.email,
        contraseña=hashed_password,
        proveedor=request.provider
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    # Notificar al user-service para que cree el perfil
    try:
        async with httpx.AsyncClient() as client:
            user_profile_data = {
                "id_usuario": user.id_usuario,
                "nombre": user.nombre,
                "apellido": user.apellido,
                "correo": user.correo,
            }
            response = await client.post(f"{USER_SERVICE_URL}/users/", json=user_profile_data)
            response.raise_for_status() # Lanza un error si la solicitud falla
    except httpx.RequestError as e:
        # En un sistema real, aquí manejarías el error (e.g., reintentos, logs)
        # Por ahora, lanzamos una excepción para saber que algo falló
        print(f"Error al notificar al user-service: {e}")
        raise HTTPException(status_code=500, detail="Error al crear el perfil de usuario.")

    # En una arquitectura real, aquí podrías emitir un evento 'user_created'
    return {"status": "success", "message": "Usuario registrado correctamente", "user_id": user.id_usuario}

@router.post("/login")
async def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(correo=request.email).first()
    if not user or not verify_password(request.password, user.contraseña):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    access_token = create_access_token(data={"sub": user.correo})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-google")
async def login_google_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(correo=request.email).first()
    if not user:
        user = User(
            nombre=request.name,
            correo=request.email,
            proveedor="google"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    access_token = create_access_token(data={"sub": user.correo})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(correo=request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    reset_token = create_access_token(data={"sub": user.correo}, expires_delta=timedelta(minutes=10))
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    
    message = MessageSchema(
        subject="Restablecimiento de Contraseña - RETOFIT",
        recipients=[request.email],
        body=f"Haz clic en el enlace para restablecer tu contraseña: {reset_link}",
        subtype="html"
    )
    await fastmail.send_message(message)
    return {"status": "success", "message": "Enlace de restablecimiento enviado"}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = decode_access_token(request.token)
        email = payload.get("sub")
        user = db.query(User).filter_by(correo=email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user.contraseña = get_password_hash(request.new_password)
        db.commit()
        return {"status": "success", "message": "Contraseña cambiada correctamente"}
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        raise HTTPException(status_code=400, detail="Token inválido o expirado")