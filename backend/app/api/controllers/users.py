from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr
import firebase_admin
from firebase_admin import credentials, firestore
import bcrypt
from jose import jwt
import os
from pydantic import BaseModel, EmailStr
from firebase_admin import auth as firebase_auth

if not firebase_admin._apps:
    cred = credentials.Certificate("app/firebase/serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()
router = APIRouter()

# (JWT Secret)
JWT_SECRET = "supersecret_dont_share"


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.get("/")
async def get_users():
    users_ref = db.collection("users").stream()
    users = []
    for user in users_ref:
        user_data = user.to_dict()
        user_data.pop("password", None)
        user_data["id"] = user.id
        users.append(user_data)
    return {"users": users}


@router.post("/signup")
async def signup(user: UserSignup):
    users_ref = db.collection("users")
    existing_user = list(users_ref.where("email", "==", user.email).stream())
    if existing_user:
        raise HTTPException(status_code=422, detail="User already exists")

    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pw.decode('utf-8')
    }

    user_ref = users_ref.add(new_user)
    user_id = user_ref[1].id

    token = jwt.encode({"user_id": user_id, "email": user.email}, JWT_SECRET, algorithm="HS256")

    return {"userId": user_id, "email": user.email, "token": token}


@router.post("/login")
async def login(user: UserLogin):
    users_ref = db.collection("users")
    user_docs = list(users_ref.where("email", "==", user.email).stream())

    if not user_docs:
        raise HTTPException(status_code=403, detail="Invalid credentials")

    user_data = user_docs[0].to_dict()
    user_id = user_docs[0].id

    if not bcrypt.checkpw(user.password.encode('utf-8'), user_data["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode({"user_id": user_id, "email": user.email}, JWT_SECRET, algorithm="HS256")

    return {"userId": user_id, "email": user.email, "token": token}





class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    users_ref = db.collection("users")
    user_docs = list(users_ref.where("email", "==", data.email).stream())

    if not user_docs:
        raise HTTPException(status_code=404, detail="Email not found")

    # f
    return {"message": f"Reset link sent to {data.email}"}
