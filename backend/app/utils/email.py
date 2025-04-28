import smtplib
from email.message import EmailMessage

def send_verification_email(to_email: str, otp: str):
    msg = EmailMessage()
    msg["Subject"] = "Password Reset Verification"
    msg["From"] = "Your App <lifehalal6@gmail.com>"
    msg["To"] = to_email
    msg.set_content(f"Your verification code is: {otp}")

    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.starttls()
        smtp.login("lifehalal6@gmail.com", "fdor cdnw uqew dehq")  #App Password
        smtp.send_message(msg)
