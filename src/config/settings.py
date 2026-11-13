from pydantic_settings import BaseSettings , SettingsConfigDict

class Settings(BaseSettings):
    model_config= SettingsConfigDict(env_file=".env" , extra="ignore")
    DB_URL:str
    JWT_SECRET:str
    SMTP_USERNAME:str
    SMTP_PASSWORD:str
    SMTP_HOST:str
    SMTP_PORT:str

settings = Settings()