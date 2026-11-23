from fastapi import FastAPI
from src.config.db import Base , engine
from src.models import *
from src.api.v1.auth import auth_routes
from src.api.v1.document import document_routes
from src.api.v1.rag import rag_routes
from src.api.v1.conversations import conversation_routes
from src.api.v1.summeries import summary_routes
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes)
app.include_router(document_routes)
app.include_router(rag_routes)
app.include_router(conversation_routes)
app.include_router(summary_routes, prefix="/api/v1")


@app.get('/')
def root():
    return {
        "message":"Welcome to Nyaya AI"
    }

