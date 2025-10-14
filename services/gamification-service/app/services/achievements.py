from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

async def check_and_award_achievements(db: AsyncIOMotorDatabase, user_id: int):
    """
    Verifica y otorga logros a un usuario basado en su progreso total.
    """
    definitions_cursor = db["logros_definiciones"].find()
    user_achievements_cursor = db["logros"].find({"id_usuario": user_id})
    
    definitions = await definitions_cursor.to_list(length=100)
    user_achievements = await user_achievements_cursor.to_list(length=100)
    
    achieved_names = {logro["nombre"] for logro in user_achievements}

    # Simulación de datos que vendrían del 'activities-service'
    total_distance = 10
    total_activities = 5

    for definition in definitions:
        if definition["nombre"] in achieved_names:
            continue

        achievement_earned = False
        
        if definition["regla_tipo"] == "SUMA_DISTANCIA":
            if total_distance >= definition["regla_valor"]:
                achievement_earned = True
        elif definition["regla_tipo"] == "CONTEO_ACTIVIDADES":
            if total_activities >= definition["regla_valor"]:
                achievement_earned = True
        
        if achievement_earned:
            await db["logros"].insert_one({
                "nombre": definition["nombre"],
                "descripcion": definition["descripcion"],
                "id_usuario": user_id,
                "fecha_obtencion": datetime.now()
            })