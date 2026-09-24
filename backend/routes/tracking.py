import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import TrackingLocationModel, BookingModel, FundiModel
from schemas import TrackingInfoSchema, TrackingUpdateSchema

router = APIRouter(tags=["Tracking"])

@router.get("/tracking/{booking_id}", response_model=TrackingInfoSchema)
def get_booking_tracking(booking_id: str, db: Session = Depends(get_db)):
    track_item = db.query(TrackingLocationModel).filter(TrackingLocationModel.booking_id == booking_id).first()
    
    if not track_item:
        # Check if booking exists
        booking = db.query(BookingModel).filter(BookingModel.id == booking_id).first()
        fundi_name = booking.fundi_name if booking else "Fundi Specialist"
        fundi_id = booking.fundi_id if booking else "fundi_1"
        
        # Default coordinates around Nairobi / Westlands
        track_item = TrackingLocationModel(
            id=booking_id,
            booking_id=booking_id,
            fundi_id=fundi_id,
            fundi_name=fundi_name,
            fundi_lat=-1.286389, # Central Nairobi
            fundi_lng=36.817223,
            client_lat=-1.265000, # Westlands
            client_lng=36.805000,
            status="en_route",
            eta_minutes=8,
            distance_km=1.8,
            updated_at=datetime.datetime.now().isoformat()
        )
        db.add(track_item)
        db.commit()
        db.refresh(track_item)
        
    return track_item

@router.post("/tracking/{booking_id}/location", response_model=TrackingInfoSchema)
def update_booking_location(
    booking_id: str,
    update: TrackingUpdateSchema,
    db: Session = Depends(get_db)
):
    track_item = db.query(TrackingLocationModel).filter(TrackingLocationModel.booking_id == booking_id).first()
    if not track_item:
        raise HTTPException(status_code=404, detail="Tracking record not found")
        
    if update.fundi_lat is not None:
        track_item.fundi_lat = update.fundi_lat
    if update.fundi_lng is not None:
        track_item.fundi_lng = update.fundi_lng
    if update.status is not None:
        track_item.status = update.status
    if update.eta_minutes is not None:
        track_item.eta_minutes = update.eta_minutes
    if update.distance_km is not None:
        track_item.distance_km = update.distance_km
        
    track_item.updated_at = datetime.datetime.now().isoformat()
    db.commit()
    db.refresh(track_item)
    return track_item
