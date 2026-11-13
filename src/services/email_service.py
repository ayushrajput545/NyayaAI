import smtplib
from email.message import EmailMessage
from src.config.settings import settings

def send_otp_email(email:str , otp:str):
    message = EmailMessage()

    message["Subject"] = "NyayaAI - Email Verification OTP"
    message["From"] = "rajputayush694@gmail.com"
    message["To"] = email

    message.set_content(
        f"""
            Hello,

            Your OTP for verifying your NyayaAI account is:

            {otp}

            This OTP is valid for 10 minutes.

            If you did not request this, please ignore this email.

            Regards,
            NyayaAI Team
            """
    )

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(
            settings.SMTP_USERNAME,
            settings.SMTP_PASSWORD
        )
        server.send_message(message)