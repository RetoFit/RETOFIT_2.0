from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as gamification_router
from app.db.session import connect_to_mongo, close_mongo_connection

app = FastAPI(title="Gamification Service")

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gamification_router, prefix="/gamification", tags=["Gamification"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Gamification Service"}