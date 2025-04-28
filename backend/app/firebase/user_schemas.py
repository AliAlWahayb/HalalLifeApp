#user_schemas.py
from pydantic import BaseModel, EmailStr


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    
class PhoneAuthData(BaseModel):
    uid: str
    phone_number: str
    created_at: str
    
class ChangePasswordRequest(BaseModel):
    user_id: str
    current_password: str
    new_password: str
    
class ChangeNameRequest(BaseModel):
    user_id: str
    new_name: str
    
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str
    
class VerifyCodeRequest(BaseModel):
    email: EmailStr
    otp: str


