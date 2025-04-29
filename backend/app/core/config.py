import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = os.getenv("APP_NAME", "HalalLifeAPI")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    API_PREFIX: str = os.getenv("API_PREFIX", "/api")

    # Firebase Settings
    FIREBASE_CREDENTIALS: Optional[str] = os.getenv("FIREBASE_CREDENTIALS")
    FIREBASE_CREDENTIALS_PATH: Optional[str] = os.getenv(
        "FIREBASE_CREDENTIALS_PATH")

    # SQLite Settings
    SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", "app_local.db")

    # Authentication Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key_here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # CORS Settings
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:19006")
        
    # AI API Settings
    GOOGLE_GENERATIVE_AI_API_KEY: Optional[str] = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
    DEEPSEEK_API_KEY: Optional[str] = os.getenv("DEEPSEEK_API_KEY")
    
    # AI Model Settings
    AI_API_ENDPOINT: str = "https://api.deepseek.com/v1/chat/completions"  # DeepSeek endpoint
    AI_MODEL_NAME: str = "deepseek-chat"  # DeepSeek model
    VISION_API_ENDPOINT: str = "https://api.deepseek.com/v1/chat/completions"  # DeepSeek for vision
    VISION_MODEL_NAME: str = "deepseek-vision"  # DeepSeek vision model
    MEDIA_ROOT: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "media")

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
