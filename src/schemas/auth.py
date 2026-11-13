from pydantic import BaseModel , Field , EmailStr

class RegisterRequest(BaseModel):
    name:str = Field(min_length=2, max_length=150)
    email:EmailStr
    password: str = Field(min_length=8, max_length=128)

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(pattern=r"^\d{6}$")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ResendOTPRequest(BaseModel):
    email: EmailStr

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_verified: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse