#routes/users.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import firebase_admin
from firebase_admin import credentials, firestore
import bcrypt
from jose import jwt
import os
from pydantic import BaseModel, EmailStr
from firebase_admin import auth as firebase_auth
from app.firebase.firebase import db
from app.firebase.user_schemas import UserSignup, UserLogin, PhoneAuthData, ChangePasswordRequest, ChangeNameRequest , ResetPasswordRequest, ForgotPasswordRequest, VerifyCodeRequest
from app.utils.otp import generate_otp
from app.utils.email import send_verification_email
from app.utils.otp_store import save_otp, verify_otp




router = APIRouter()


JWT_SECRET = "supersecret_dont_share"

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

    return {
    "userId": user_id,
    "email": user.email,
    "name": user_data.get("name", ""),
    "token": token
}


@router.post("/phone-auth")
def phone_auth(user: PhoneAuthData):
    users_ref = db.collection("users")
    existing_user = users_ref.where("uid", "==", user.uid).stream()
    if any(existing_user):
        return {"message": "User already exists", "uid": user.uid}

    new_user = {
        "uid": user.uid,
        "phone_number": user.phone_number,
        "created_at": user.created_at
    }
    users_ref.add(new_user)
    return {"message": "Phone auth user saved", "uid": user.uid}

@router.post("/change-password")
async def change_password(data: ChangePasswordRequest):
    users_ref = db.collection("users")
    user_doc = users_ref.document(data.user_id).get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_doc.to_dict()
    stored_pw = user_data.get("password")

    if not stored_pw or not bcrypt.checkpw(data.current_password.encode('utf-8'), stored_pw.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    new_hashed_pw = bcrypt.hashpw(data.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    users_ref.document(data.user_id).update({"password": new_hashed_pw})

    return {"message": "Password updated successfully"}

@router.post("/change-name")
async def change_name(data: ChangeNameRequest):
    users_ref = db.collection("users")
    user_doc = users_ref.document(data.user_id).get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    users_ref.document(data.user_id).update({"name": data.new_name})
    return {"message": "Name updated successfully"}

@router.delete("/delete-account/{user_id}")
async def delete_account(user_id: str):
    users_ref = db.collection("users")
    user_doc = users_ref.document(user_id).get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    users_ref.document(user_id).delete()

    return {"message": "Account deleted successfully"}

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    users_ref = db.collection("users")
    user_docs = list(users_ref.where("email", "==", req.email).stream())

    if not user_docs:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()
    save_otp(req.email, otp)
    send_verification_email(req.email, otp)

    return {"message": "Verification code sent to your email."}


@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    if not verify_otp(req.email, req.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired code")

    users_ref = db.collection("users")
    user_docs = list(users_ref.where("email", "==", req.email).stream())

    if not user_docs:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = user_docs[0].id
    new_hashed_pw = bcrypt.hashpw(req.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    users_ref.document(user_id).update({
        "password": new_hashed_pw
    })

    return {"message": "Password updated successfully."}

@router.post("/verify-code")
async def verify_code(req: VerifyCodeRequest):
    if not verify_otp(req.email, req.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    
    return {"message": "Code is valid"}


