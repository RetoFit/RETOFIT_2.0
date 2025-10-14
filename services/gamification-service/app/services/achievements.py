# app/services/achievements.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.models import Actividad, Logro, LogroDefinicion

def check_and_award_achievements(db: Session, user_id: int):
    """
    Verifica y otorga logros a un usuario basado en su progreso total.
    """
    definitions = db.query(LogroDefinicion).all()
    user_achievements = db.query(Logro).filter(Logro.id_usuario == user_id).all()
    achieved_names = {logro.nombre for logro in user_achievements}

    for definition in definitions:
        if definition.nombre in achieved_names:
            continue

        achievement_earned = False
        
        if definition.regla_tipo == "SUMA_DISTANCIA":
            total_distance = db.query(func.sum(Actividad.distancia_km)).filter(Actividad.id_usuario == user_id).scalar() or 0
            if total_distance >= definition.regla_valor:
                achievement_earned = True

        elif definition.regla_tipo == "CONTEO_ACTIVIDADES":
            total_activities = db.query(func.count(Actividad.id_actividad)).filter(Actividad.id_usuario == user_id).scalar() or 0
            if total_activities >= definition.regla_valor:
                achievement_earned = True
        
        if achievement_earned:
            new_logro = Logro(
                nombre=definition.nombre,
                descripcion=definition.descripcion,
                id_usuario=user_id
            )
            db.add(new_logro)
            # Aquí se podría emitir un evento para notificar al usuario (e.g., push notification)

    db.commit()