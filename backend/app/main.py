from fastapi import FastAPI
from app.api.HalalCheck import ecodes, ingredients, status
from app.api.Products import Products
from app.api.controllers import phone_auth, users
from app.database.database import create_db_and_tables


import app.firebase


app = FastAPI(
    title="HalalLife API",
    docs_url="/docs",
    redoc_url="/redoc",
    version="1.0.0",
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()




app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(phone_auth.router, prefix="/api", tags=["phone-auth"])
app.include_router(Products.router, prefix="/api/products", tags=["products"])
app.include_router(ingredients.router, prefix="/api/ingredients", tags=["ingredients"])
app.include_router(ecodes.router, prefix="/api/ecodes", tags=["ecodes"])
app.include_router(status.router, prefix="/api/status", tags=["status"])
