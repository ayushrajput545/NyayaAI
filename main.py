from fastapi import FastAPI
from src.config.db import Base , engine
from src.models import *

Base.metadata.create_all(engine)

app = FastAPI()


@app.get('/')
def root():
    return {
        "message":"Welcome to Nyaya AI"
    }

