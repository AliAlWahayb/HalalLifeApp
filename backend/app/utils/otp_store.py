from datetime import datetime, timedelta

otp_storage = {}

def save_otp(email: str, otp: str):
    otp_storage[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=10)
    }

def verify_otp(email: str, otp: str):
    data = otp_storage.get(email)
    if not data:
        return False
    if data["otp"] != otp:
        return False
    if datetime.utcnow() > data["expires_at"]:
        return False
    return True
