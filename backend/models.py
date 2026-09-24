from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class CategoryModel(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    active_count = Column(Integer, default=0)
    bg_gradient = Column(JSON, nullable=True)

class FundiModel(Base):
    __tablename__ = "fundis"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=False)
    cover_image = Column(String, nullable=True)
    category = Column(String, nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    experience_years = Column(Integer, default=0)
    completed_jobs = Column(Integer, default=0)
    hourly_rate = Column(Integer, default=0)
    estimated_price = Column(Integer, default=0)
    distance_km = Column(Float, default=0.0)
    location_name = Column(String, nullable=False)
    is_verified = Column(Boolean, default=True)
    is_available = Column(Boolean, default=True)
    is_popular = Column(Boolean, default=False)
    bio = Column(Text, nullable=True)
    phone = Column(String, nullable=False)
    whatsapp = Column(String, nullable=True)
    skills = Column(JSON, default=list)

    portfolio = relationship("PortfolioItemModel", back_populates="fundi", cascade="all, delete-orphan")
    reviews = relationship("ReviewModel", back_populates="fundi", cascade="all, delete-orphan")

class PortfolioItemModel(Base):
    __tablename__ = "portfolio_items"

    id = Column(String, primary_key=True, index=True)
    fundi_id = Column(String, ForeignKey("fundis.id"), nullable=False)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    category = Column(String, nullable=False)

    fundi = relationship("FundiModel", back_populates="portfolio")

class ReviewModel(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, index=True)
    fundi_id = Column(String, ForeignKey("fundis.id"), nullable=False)
    user_name = Column(String, nullable=False)
    user_avatar = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    date = Column(String, nullable=False)
    comment = Column(Text, nullable=False)

    fundi = relationship("FundiModel", back_populates="reviews")

class BookingModel(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    fundi_id = Column(String, nullable=False)
    fundi_name = Column(String, nullable=False)
    fundi_avatar = Column(String, nullable=False)
    fundi_category = Column(String, nullable=False)
    fundi_phone = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time_slot = Column(String, nullable=False)
    address = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    payment_method = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    commission_rate = Column(Float, default=15.0)
    commission_amount = Column(Integer, default=0)
    fundi_earnings = Column(Integer, default=0)
    status = Column(String, default="pending")
    created_at = Column(String, nullable=False)

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    address = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="client")  # client, fundi, owner
    fundi_id = Column(String, nullable=True)

class CommissionSettingsModel(Base):
    __tablename__ = "commission_settings"

    id = Column(String, primary_key=True, default="default")
    rate_percent = Column(Float, default=15.0)
    updated_at = Column(String, nullable=True)

class ChatMessageModel(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)
    booking_id = Column(String, nullable=True, index=True)
    fundi_id = Column(String, nullable=False, index=True)
    sender_id = Column(String, nullable=False)
    sender_role = Column(String, nullable=False, default="client") # client, fundi
    sender_name = Column(String, nullable=False)
    receiver_id = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    timestamp = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)

class TrackingLocationModel(Base):
    __tablename__ = "tracking_locations"

    id = Column(String, primary_key=True, index=True) # booking_id
    booking_id = Column(String, nullable=False, index=True)
    fundi_id = Column(String, nullable=False)
    fundi_name = Column(String, nullable=False)
    fundi_lat = Column(Float, nullable=False, default=-1.286389) # Nairobi Default
    fundi_lng = Column(Float, nullable=False, default=36.817223)
    client_lat = Column(Float, nullable=False, default=-1.265000) # Westlands Default
    client_lng = Column(Float, nullable=False, default=36.805000)
    status = Column(String, default="en_route") # assigned, en_route, arrived, in_progress, completed
    eta_minutes = Column(Integer, default=8)
    distance_km = Column(Float, default=1.8)
    updated_at = Column(String, nullable=False)


