# user-service/app/api/endpoints.py

import os
import shutil
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import User, UserUpdateRequest, UserProfileResponse
from app.services.token import get_current_user_email

# >>> ESTA LÍNEA ES LA CLAVE <<<
router = APIRouter() 

BACKEND_URL = "http://127.0.0.1:8004"
print(f"--- LA URL DEL BACKEND ESTÁ CONFIGURADA COMO: {BACKEND_URL} ---")

@router.get("/me", response_model=UserProfileResponse)
async def get_current_user(email: str = Depends(get_current_user_email), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.correo == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return UserProfileResponse(
        id=user.id_usuario,
        username=user.nombre,
        lastname=user.apellido,
        email=user.correo,
        age=user.edad,
        weight=user.peso,
        height=user.altura,
        gender=user.genero,
        fitness_level=user.nivel_condicion_fisica,
        foto_perfil_url=user.foto_perfil_url,
        deportes_favoritos=user.deportes_favoritos
        
    )

@router.put("/me")
async def update_current_user(
    update_data: UserUpdateRequest,
    email: str = Depends(get_current_user_email),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.correo == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    update_data_dict = update_data.dict(exclude_unset=True)
    for key, value in update_data_dict.items():
        setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return {"status": "success", "message": "Perfil actualizado correctamente"}

@router.post("/upload-profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    email: str = Depends(get_current_user_email),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.correo == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    os.makedirs("static/images", exist_ok=True)
    
    file_extension = file.filename.split(".")[-1]
    file_name = f"{user.id_usuario}_{int(datetime.now(timezone.utc).timestamp())}.{file_extension}"
    file_path = f"static/images/{file_name}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"{BACKEND_URL}/{file_path}"
    user.foto_perfil_url = file_url
    db.commit()

    return {"status": "success", "file_url": file_url}