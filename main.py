from fastapi import FastAPI
from src.config.db import Base , engine
from src.models import *
from src.api.v1.auth import auth_routes

Base.metadata.create_all(engine)

app = FastAPI()
app.include_router(auth_routes)



@app.get('/')
def root():
    return {
        "message":"Welcome to Nyaya AI"
    }

