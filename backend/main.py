import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.core.config import settings
from app.api.api_v1.api import api_router
from app.db.firebase import initialize_firebase
from app.db.sqlite import initialize_sqlite_tables

load_dotenv()

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
)

# Set up CORS
origins = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    return {"message": "Welcome to HalalLife API"}


@app.on_event("startup")
async def startup_db_client():
    """Initialize database connections on startup"""
    try:
        # Initialize Firebase
        initialize_firebase()

        # Initialize SQLite tables for local storage
        await initialize_sqlite_tables()
    except Exception as e:
        print(f"Error initializing databases: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
