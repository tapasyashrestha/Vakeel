from dotenv import load_dotenv
from pathlib import Path
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import chambers, invites
from backend.routers.ai import router as ai_router
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

app = FastAPI(title="Vakeel Multi-Tenant Isolation API (Supabase)")

# Retrieve origins from environment variables
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
origins = [origin.strip() for origin in frontend_url.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chambers.router, tags=["Chambers"])
app.include_router(invites.router, tags=["Invites"])
app.include_router(ai_router)
