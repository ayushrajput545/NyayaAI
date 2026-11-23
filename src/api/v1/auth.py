from fastapi import FastAPI , Depends , APIRouter , HTTPException, status
from src.schemas.auth import (RegisterRequest , VerifyOTPRequest, ResendOTPRequest , TokenResponse,LoginRequest,UserResponse)
from sqlalchemy.orm import Session
from src.config.db import get_db
from src.models.user import User
from src.models.email_otp import EmailOTP
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from src.core.security import (generate_otp , hash_password , hash_otp , verify_otp,verify_password , create_access_token)
from src.services.email_service import send_otp_email
from src.core.dependencies import get_current_user

auth_routes = APIRouter(prefix="/auth/api/v1")


def create_and_send_otp(db: Session, user: User):
    # Remove any previously generated OTP for this user.
    old_otps = db.scalars(
        select(EmailOTP).where(EmailOTP.user_id == user.id)
    ).all()

    for old_otp in old_otps:
        db.delete(old_otp)

    otp = generate_otp()

    otp_record = EmailOTP(
        user_id=user.id,
        otp_hash=hash_otp(otp),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
    )

    db.add(otp_record)
    db.flush()

    # Send email before committing the new OTP.
    send_otp_email(user.email, otp)


@auth_routes.post('/register', status_code=status.HTTP_201_CREATED)
def register(body:RegisterRequest , db:Session=Depends(get_db)):
    email = body.email

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user is not None:
        if existing_user.is_verified:
            raise HTTPException(
                status_code=409,
                detail="An account with this email already exists."
            )

        # Existing unverified account: replace its password and resend OTP.
        existing_user.name = body.name
        existing_user.hashed_password = hash_password(body.password)

        try:
            create_and_send_otp(db, existing_user)
            db.commit()
        except Exception:
            db.rollback()
            raise HTTPException(
                    status_code=503,
                    detail="Unable to send verification email. Please try again."
            )

        return {
            "message": "Verification OTP sent to your email."
        }

    # IF USER NOT EXISTS
    user = User(
        name = body.name,
        email=body.email,
        hashed_password=hash_password(body.password),
        is_verified=False, 
    )

    try:
        db.add(user)
        db.flush()
        create_and_send_otp(db, user)
        db.commit()
    except Exception as exc:
        db.rollback()
        print(exc)
        raise HTTPException(
            status_code=503,
            detail="Unable to register or send verification email."
        )

    return {
        "message": "Registration successful. OTP sent to your email."
    }


@auth_routes.post('/verify-email')
def verify_email(body:VerifyOTPRequest , db:Session = Depends(get_db)):
    email = body.email
    user = db.scalar(select(User).where(User.email == email))
    print(user)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if user.is_verified:
        return {"message": "Email is already verified."}

    otp_record = db.scalar(
        select(EmailOTP)
        .where(EmailOTP.user_id == user.id)
        .order_by(EmailOTP.created_at.desc())
    )

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="OTP not found. Please request a new OTP."
        )

    now = datetime.now(timezone.utc)

    if otp_record.expires_at <= now:
        db.delete(otp_record)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="OTP has expired. Please request a new OTP."
        )


    if not verify_otp(body.otp, otp_record.otp_hash):
        otp_record.attempts += 1

        if otp_record.attempts >= 5:
            db.delete(otp_record)

        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP."
        )

    user.is_verified = True
    db.delete(otp_record)
    db.commit()
    return {
        "message": "Email verified successfully. You can now log in."
    }

@auth_routes.post("/resend-otp")
def resend_otp(payload: ResendOTPRequest,db: Session = Depends(get_db)):
    email = payload.email.lower()

    user = db.scalar(
        select(User).where(User.email == email)
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already verified."
        )

    try:
        create_and_send_otp(db, user)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Unable to send OTP. Please try again."
        )

    return {
        "message": "A new verification OTP has been sent."
    }


@auth_routes.post('/login', response_model=TokenResponse)
def login(body:LoginRequest , db:Session=Depends(get_db)):
    email = body.email.lower()
    user = db.scalar(select(User).where(User.email == email))
    print("Hittinnnggg........")

    if not user or not verify_password(body.password , user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in."
        )

    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user":{
            "id": user.id,
            "name":user.name,
            "email":user.email,
            "is_verified": user.is_verified,
        }
    }


# Dependency
@auth_routes.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_verified": current_user.is_verified,
    }