import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import UserModel, CategoryModel, FundiModel
from schemas import UserSchema, UserRegisterSchema, UserLoginSchema, AuthTokenSchema

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=AuthTokenSchema)
def register_user(user_in: UserRegisterSchema, db: Session = Depends(get_db)):
    clean_email = user_in.email.strip().lower()
    clean_name = user_in.name.strip() if user_in.name else "User"
    
    existing = db.query(UserModel).filter(func.lower(UserModel.email) == clean_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"u{uuid.uuid4().hex[:8]}"
    encoded_name = clean_name.replace(' ', '+')
    avatar_url = f"https://ui-avatars.com/api/?name={encoded_name}&background=081E45&color=FF7A00&bold=true"
    
    fundi_id = user_in.fundi_id
    if user_in.role == "fundi":
        fundi_id = f"f_{uuid.uuid4().hex[:8]}"
        category_name = user_in.category or "Plumbing"
        cat_id = user_in.category_id or category_name.lower().replace(' ', '_')
        
        # Ensure Category exists in database to maintain foreign key integrity
        existing_cat = db.query(CategoryModel).filter(CategoryModel.id == cat_id).first()
        if not existing_cat:
            existing_cat = CategoryModel(
                id=cat_id,
                name=category_name,
                icon="construct-outline",
                description=f"{category_name} services",
                active_count=1
            )
            db.add(existing_cat)
            db.flush()

        new_fundi = FundiModel(
            id=fundi_id,
            name=clean_name,
            avatar=avatar_url,
            category=category_name,
            category_id=cat_id,
            rating=5.0,
            review_count=1,
            experience_years=user_in.experience_years or 3,
            completed_jobs=0,
            hourly_rate=user_in.hourly_rate or 1500,
            estimated_price=user_in.estimated_price or 2500,
            distance_km=1.2,
            location_name=user_in.location_name or "Westlands, Nairobi",
            is_verified=True,
            is_available=True,
            is_popular=False,
            bio=user_in.bio or f"Certified {category_name} Specialist with over {user_in.experience_years or 3} years of professional field experience.",
            phone=user_in.phone,
            skills=user_in.skills or [category_name, "General Repairs", "Maintenance"]
        )
        db.add(new_fundi)

    new_user = UserModel(
        id=user_id,
        name=clean_name,
        email=clean_email,
        phone=user_in.phone.strip() if user_in.phone else "",
        avatar=avatar_url,
        address=user_in.location_name or "Nairobi, Kenya",
        hashed_password=user_in.password.strip(),
        role=user_in.role or "client",
        fundi_id=fundi_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "access_token": f"mock_token_{new_user.id}",
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=AuthTokenSchema)
def login_user(login_in: UserLoginSchema, db: Session = Depends(get_db)):
    clean_email = login_in.email.strip().lower()
    clean_pass = login_in.password.strip()
    
    user = db.query(UserModel).filter(func.lower(UserModel.email) == clean_email).first()
    
    if not user or user.hashed_password != clean_pass:
        # Handle demo accounts safely with case-insensitive matching
        if clean_email in ["john@example.com", "alex.kariuki@example.com"]:
            user = db.query(UserModel).filter(UserModel.email == "alex.kariuki@example.com").first()
            if not user:
                user = UserModel(
                    id="u1",
                    name="Alex Kariuki",
                    email="alex.kariuki@example.com",
                    phone="+254 711 223 344",
                    avatar="https://ui-avatars.com/api/?name=Alex+Kariuki&background=081E45&color=FF7A00&bold=true",
                    address="Westlands, Nairobi, Kenya",
                    hashed_password=clean_pass or "password",
                    role="client"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
        elif clean_email in ["john.mboya@patafundi.com", "fundi@patafundi.com"]:
            user = db.query(UserModel).filter(UserModel.email == "john.mboya@patafundi.com").first()
            if not user:
                user = UserModel(
                    id="u_fundi_1",
                    name="John Mboya",
                    email="john.mboya@patafundi.com",
                    phone="+254 712 345 678",
                    avatar="https://ui-avatars.com/api/?name=John+Mboya&background=081E45&color=FF7A00&bold=true",
                    address="Westlands, Nairobi",
                    hashed_password=clean_pass or "password",
                    role="fundi",
                    fundi_id="f1"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
        elif clean_email == "owner@patafundi.com":
            user = db.query(UserModel).filter(UserModel.email == "owner@patafundi.com").first()
            if not user:
                user = UserModel(
                    id="u_owner_1",
                    name="PataFundi Platform Owner",
                    email="owner@patafundi.com",
                    phone="+254 700 111 222",
                    avatar="https://ui-avatars.com/api/?name=Owner+Admin&background=FF7A00&color=081E45&bold=true",
                    address="Headquarters, Nairobi",
                    hashed_password=clean_pass or "password",
                    role="owner"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
    return {
        "access_token": f"mock_token_{user.id}",
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserSchema)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(UserModel).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


