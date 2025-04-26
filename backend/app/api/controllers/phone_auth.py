from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.firebase.firebase import db


router = APIRouter()

class PhoneAuthData(BaseModel):
    uid: str
    phone_number: str
    created_at: str

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
