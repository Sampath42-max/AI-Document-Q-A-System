from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router.upload import router as upload_router
from router.chat import router as chat_router
from router.history import router as history_router
from router.auth import router as auth_router
from Database import init_db

# Initialize database
init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    tags=["Authentication"]
)

app.include_router(
    upload_router,
    tags=["File Upload"]
)

app.include_router(
    chat_router,
    tags=["Chat"]  
)

app.include_router(
    history_router,
    tags=["History"]
)

@app.get("/")
def hello():
    return {
        "status": "running",
        "message": "Welcome to AI Document Q&A API 🚀",
        "docs": "/docs",
        "redoc": "/redoc"
    }