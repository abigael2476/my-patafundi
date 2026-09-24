from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routes import categories, fundis, bookings, auth, owner, chat, tracking
from seed import seed_db

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

# Auto-seed initial data if database is empty
try:
    db = SessionLocal()
    from models import CategoryModel
    if db.query(CategoryModel).count() == 0:
        seed_db()
finally:
    db.close()

app = FastAPI(
    title="PataFundi Backend API",
    description="REST API connecting artisan fundis with customers in Kenya",
    version="1.0.0"
)

# CORS middleware for mobile and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(categories.router, prefix="/api/v1")
app.include_router(fundis.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(owner.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(tracking.router, prefix="/api/v1")


@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "PataFundi Backend API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
