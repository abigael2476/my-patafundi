import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import BookingModel, FundiModel, CommissionSettingsModel
from schemas import OwnerSummarySchema, CommissionUpdateSchema, EarningsLogSchema

router = APIRouter(prefix="/owner", tags=["Owner / Commission"])

def get_current_commission_rate(db: Session) -> float:
    setting = db.query(CommissionSettingsModel).filter(CommissionSettingsModel.id == "default").first()
    if not setting:
        setting = CommissionSettingsModel(id="default", rate_percent=0.0, updated_at=datetime.datetime.utcnow().isoformat())
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting.rate_percent

@router.get("/summary", response_model=OwnerSummarySchema)
def get_owner_summary(db: Session = Depends(get_db)):
    commission_rate = get_current_commission_rate(db)
    bookings = db.query(BookingModel).all()
    fundis_count = db.query(FundiModel).count()
    
    total_gross_volume = sum(b.amount for b in bookings if b.status != "cancelled")
    total_owner_commission = sum(b.commission_amount for b in bookings if b.status != "cancelled")
    total_fundi_payouts = sum(b.fundi_earnings for b in bookings if b.status != "cancelled")
    completed_bookings_count = sum(1 for b in bookings if b.status == "completed")

    return {
        "total_gross_volume": total_gross_volume,
        "total_owner_commission": total_owner_commission,
        "total_fundi_payouts": total_fundi_payouts,
        "completed_bookings_count": completed_bookings_count,
        "active_fundis_count": fundis_count,
        "commission_rate_percent": commission_rate,
    }

@router.get("/commission")
def get_commission_rate(db: Session = Depends(get_db)):
    rate = get_current_commission_rate(db)
    return {"commission_rate_percent": rate}

@router.post("/commission")
def update_commission_rate(payload: CommissionUpdateSchema, db: Session = Depends(get_db)):
    if payload.rate_percent < 0 or payload.rate_percent > 50:
        raise HTTPException(status_code=400, detail="Commission rate must be between 0% and 50%")
    
    setting = db.query(CommissionSettingsModel).filter(CommissionSettingsModel.id == "default").first()
    if not setting:
        setting = CommissionSettingsModel(id="default", rate_percent=payload.rate_percent, updated_at=datetime.datetime.utcnow().isoformat())
        db.add(setting)
    else:
        setting.rate_percent = payload.rate_percent
        setting.updated_at = datetime.datetime.utcnow().isoformat()
    
    db.commit()
    return {"status": "success", "commission_rate_percent": payload.rate_percent}

@router.get("/earnings-log", response_model=List[EarningsLogSchema])
def get_earnings_log(db: Session = Depends(get_db)):
    bookings = db.query(BookingModel).order_by(BookingModel.created_at.desc()).all()
    logs = []
    for b in bookings:
        logs.append({
            "booking_id": b.id,
            "fundi_name": b.fundi_name,
            "category": b.fundi_category,
            "date": b.date,
            "amount": b.amount,
            "commission_rate": b.commission_rate,
            "commission_amount": b.commission_amount,
            "fundi_earnings": b.fundi_earnings,
            "status": b.status,
        })
    return logs
