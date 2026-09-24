from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import FundiModel
from schemas import FundiSchema

router = APIRouter(prefix="/fundis", tags=["Fundis"])

@router.get("", response_model=List[FundiSchema])
def get_fundis(
    category_id: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_distance: Optional[float] = None,
    max_price: Optional[int] = None,
    sort_by: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FundiModel)

    if category_id and category_id.lower() != "all":
        query = query.filter(FundiModel.category_id == category_id)

    if min_rating is not None:
        query = query.filter(FundiModel.rating >= min_rating)

    if max_distance is not None:
        query = query.filter(FundiModel.distance_km <= max_distance)

    if max_price is not None:
        query = query.filter(FundiModel.estimated_price <= max_price)

    results = query.all()

    if sort_by:
        if sort_by == "rating":
            results.sort(key=lambda x: x.rating, reverse=True)
        elif sort_by == "distance":
            results.sort(key=lambda x: x.distance_km)
        elif sort_by == "price_low":
            results.sort(key=lambda x: x.estimated_price)
        elif sort_by == "price_high":
            results.sort(key=lambda x: x.estimated_price, reverse=True)

    return results

@router.get("/{fundi_id}", response_model=FundiSchema)
def get_fundi_by_id(fundi_id: str, db: Session = Depends(get_db)):
    fundi = db.query(FundiModel).filter(FundiModel.id == fundi_id).first()
    if not fundi:
        raise HTTPException(status_code=404, detail="Fundi not found")
    return fundi
