#FastAPI dependencies are not exactly middleware, but they can perform many of the same tasks, including authentication, authorization, and database access.
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from src.config.db import get_db
import jwt
from jwt.exceptions import InvalidTokenError
from src.config.settings import settings
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.config.db import get_db
from src.models.user import User

bearer_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=["HS256"],
        )

        user_id = int(payload.get("sub"))
        if not user_id or payload.get("type") != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid access token."
            )

    except InvalidTokenError as exc:
        print(exc)
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token."
        )

    user = db.scalar(
        select(User).where(User.id == user_id)
    )

    if not user or not user.is_verified:
        raise HTTPException(
            status_code=401,
            detail="User is not authorized."
        )

    return user