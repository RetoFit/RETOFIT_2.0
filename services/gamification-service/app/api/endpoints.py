# app/api/endpoints.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.db.session import get_db
from app.db.models import (
    Puntos, Logro, LogroDefinicion, Actividad, User,
    ProcessActivityRequest, LogroResponse, AchievementProgressResponse
)
from app.services.achievements import check_and_award_achievements

router = APIRouter()

@router.post("/process-activity")
async def process_activity(request: ProcessActivityRequest, db: Session = Depends(get_db)):
    """
    Endpoint interno llamado por 'activities-service'.
    Añade puntos y dispara la verificación de logros.
    """
    # 1. Guardar los puntos recibidos
    new_points = Puntos(cantidad=request.points, id_usuario=request.user_id)
    db.add(new_points)
    db.commit()

    # 2. Verificar si se ha ganado algún logro
    check_and_award_achievements(db=db, user_id=request.user_id)

    return {"status": "success", "message": "Activity processed"}

@router.get("/users/{user_id}/achievements-progress", response_model=List[AchievementProgressResponse])
async def get_user_achievements_progress(user_id: int, db: Session = Depends(get_db)):
    all_definitions = db.query(LogroDefinicion).all()
    user_achievements = db.query(Logro).filter(Logro.id_usuario == user_id).all()
    obtained_names = {ach.nombre for ach in user_achievements}
    
    user_activities = db.query(Actividad).filter(Actividad.id_usuario == user_id).all()
    total_distance = sum(act.distancia_km or 0 for act in user_activities)
    total_activities = len(user_activities)
    
    progress_list = []
    for definition in all_definitions:
        current_progress = 0
        if definition.regla_tipo == "SUMA_DISTANCIA":
            current_progress = total_distance
        elif definition.regla_tipo == "CONTEO_ACTIVIDADES":
            current_progress = total_activities
        
        percentage = min(100, (current_progress / definition.regla_valor) * 100) if definition.regla_valor > 0 else 0
        is_obtained = definition.nombre in obtained_names
        obtained_date = next((ua.fecha_obtencion for ua in user_achievements if ua.nombre == definition.nombre), None)

        progress_list.append({
            "id": definition.id_definicion,
            "nombre": definition.nombre, "descripcion": definition.descripcion,
            "meta": definition.regla_valor, "progreso_actual": current_progress,
            "porcentaje_completado": percentage, "obtenido": is_obtained,
            "fecha_obtenido": obtained_date, "tipo_regla": definition.regla_tipo
        })
    return progress_list

@router.get("/users/ranking")
async def get_users_ranking(limit: int = 10, db: Session = Depends(get_db)):
    ranking_query = db.query(
        User.id_usuario,
        User.nombre,
        func.sum(Puntos.cantidad).label("puntos_totales")
    ).join(Puntos).group_by(User.id_usuario).order_by(func.sum(Puntos.cantidad).desc()).limit(limit).all()

    ranking_data = [
        {"position": i + 1, "id": user.id_usuario, "username": user.nombre, "puntos_totales": user.puntos_totales}
        for i, user in enumerate(ranking_query)
    ]
    return ranking_data

@router.post("/initialize-achievements")
async def initialize_default_achievements(db: Session = Depends(get_db)):
    # Esta lógica es para la configuración inicial y puede permanecer aquí.
    if db.query(LogroDefinicion).count() > 0:
        return {"message": "Las definiciones de logros ya existen"}
    
    default_achievements = [
        LogroDefinicion(nombre="Primer Paso", descripcion="Completa tu primera actividad", regla_tipo="CONTEO_ACTIVIDADES", regla_valor=1),
        LogroDefinicion(nombre="Caminante", descripcion="Acumula 5km", regla_tipo="SUMA_DISTANCIA", regla_valor=5.0),
        # ... añadir el resto de definiciones
    ]
    db.add_all(default_achievements)
    db.commit()
    return {"message": f"Se crearon {len(default_achievements)} definiciones de logros"}