import uuid
import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import BookingModel, CommissionSettingsModel
from schemas import BookingSchema, BookingCreateSchema

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("", response_model=List[BookingSchema])
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(BookingModel).order_by(BookingModel.created_at.desc()).all()
    return bookings

@router.post("", response_model=BookingSchema, status_code=201)
def create_booking(booking_in: BookingCreateSchema, db: Session = Depends(get_db)):
    booking_id = f"BK-{uuid.uuid4().hex[:6].upper()}"
    created_at = datetime.datetime.utcnow().isoformat() + "Z"
    
    # Get platform commission rate
    setting = db.query(CommissionSettingsModel).filter(CommissionSettingsModel.id == "default").first()
    comm_rate = setting.rate_percent if setting else 15.0
    
    comm_amount = int(round(booking_in.amount * (comm_rate / 100.0)))
    fundi_earn = booking_in.amount - comm_amount
    
    new_booking = BookingModel(
        id=booking_id,
        fundi_id=booking_in.fundi_id,
        fundi_name=booking_in.fundi_name,
        fundi_avatar=booking_in.fundi_avatar,
        fundi_category=booking_in.fundi_category,
        fundi_phone=booking_in.fundi_phone,
        date=booking_in.date,
        time_slot=booking_in.time_slot,
        address=booking_in.address,
        description=booking_in.description,
        payment_method=booking_in.payment_method,
        amount=booking_in.amount,
        commission_rate=comm_rate,
        commission_amount=comm_amount,
        fundi_earnings=fundi_earn,
        status="pending",
        created_at=created_at
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@router.get("/{booking_id}", response_model=BookingSchema)
def get_booking_by_id(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(BookingModel).filter(BookingModel.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.put("/{booking_id}/status", response_model=BookingSchema)
def update_booking_status(booking_id: str, status_in: dict, db: Session = Depends(get_db)):
    booking = db.query(BookingModel).filter(BookingModel.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    new_status = status_in.get("status")
    if new_status not in ["pending", "confirmed", "in_progress", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    booking.status = new_status
    db.commit()
    db.refresh(booking)
    return booking

