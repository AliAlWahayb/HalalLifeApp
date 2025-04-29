from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, ingredients, products
from app.api.chatbot import router as chatbot_router

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(
    ingredients.router, prefix="/ingredients", tags=["Ingredients"])
api_router.include_router(
    products.router, prefix="/products", tags=["Products"])
api_router.include_router(
    chatbot_router, prefix="/chatbot", tags=["Chatbot"])
