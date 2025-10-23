# app/main.py

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.endpoints import router as user_router
from .api.admin import router as admin_router
from app.db.session import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Service")


# Crear directorio para imágenes si no existe
if not os.path.exists("static/images"):
    os.makedirs("static/images")

# Montar el directorio estático para servir las imágenes
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(admin_router, prefix="/admin", tags=["Admin"])

origins = [
    "http://localhost:3000",
    # También puedes añadir otras URLs si es necesario, como la de producción
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/users", tags=["Users"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the User Service"}