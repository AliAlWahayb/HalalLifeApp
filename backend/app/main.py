from fastapi import FastAPI
from app.controllers import users, phone_auth
import app.firebase  

app = FastAPI()

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(phone_auth.router, prefix="/api", tags=["phone-auth"])
