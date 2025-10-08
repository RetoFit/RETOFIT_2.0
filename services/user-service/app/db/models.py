# app/db/models.py

from sqlalchemy import Column, Integer, String, Float
from .session import Base
from pydantic import BaseModel
from typing import Optional

class User(Base):
    __tablename__ = 'usuario'
    
    # Mantenemos todos los campos del perfil
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True, nullable=False)
    apellido = Column(String, index=True, nullable=True)
    correo = Column(String, unique=True, index=True, nullable=False) # El correo sigue siendo el identificador único
    edad = Column(Integer, nullable=True)
    peso = Column(Float, nullable=True)
    altura = Column(Float, nullable=True)
    genero = Column(String, nullable=True)
    nivel_condicion_fisica = Column(String, nullable=True)
    foto_perfil_url = Column(String, nullable=True)
    deportes_favoritos = Column(String, nullable=True)

class UserUpdateRequest(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    edad: Optional[int] = None
    peso: Optional[float] = None
    altura: Optional[float] = None
    genero: Optional[str] = None
    nivel_condicion_fisica: Optional[str] = None
    deportes_favoritos: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: int
    username: str
    lastname: Optional[str]
    email: str
    age: Optional[int]
    weight: Optional[float]
    height: Optional[float]
    gender: Optional[str]
    fitness_level: Optional[str]
    foto_perfil_url: Optional[str]
    deportes_favoritos: str | None = None
    # Se eliminan los puntos y actividades, ya que se obtendrán del gamification-service

    class Config:
        from_attributes = True