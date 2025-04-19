from fastapi import FastAPI
from app.controllers import users, phone_auth
import app.firebase  

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
)


app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(phone_auth.router, prefix="/api", tags=["phone-auth"])
