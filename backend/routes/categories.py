from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import CategoryModel
from schemas import CategorySchema

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(CategoryModel).all()
    return categories
