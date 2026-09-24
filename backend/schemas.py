from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

def to_camel(string: str) -> str:
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class CategorySchema(CamelModel):
    id: str
    name: str
    icon: str
    description: Optional[str] = None
    active_count: int = 0
    bg_gradient: Optional[List[str]] = None

class PortfolioItemSchema(CamelModel):
    id: str
    title: str
    image_url: str
    category: str

class ReviewSchema(CamelModel):
    id: str
    user_name: str
    user_avatar: str
    rating: float
    date: str
    comment: str

class FundiSchema(CamelModel):
    id: str
    name: str
    avatar: str
    cover_image: Optional[str] = None
    category: str
    category_id: str
    rating: float
    review_count: int
    experience_years: int
    completed_jobs: int
    hourly_rate: int
    estimated_price: int
    distance_km: float
    location_name: str
    is_verified: bool = True
    is_available: bool = True
    is_popular: Optional[bool] = False
    bio: Optional[str] = None
    phone: str
    whatsapp: Optional[str] = None
    skills: List[str] = []
    portfolio: List[PortfolioItemSchema] = []
    reviews: List[ReviewSchema] = []

class BookingCreateSchema(CamelModel):
    fundi_id: str
    fundi_name: str
    fundi_avatar: str
    fundi_category: str
    fundi_phone: str
    date: str
    time_slot: str
    address: str
    description: str
    payment_method: str
    amount: int
    commission_rate: Optional[float] = 15.0
    commission_amount: Optional[int] = None
    fundi_earnings: Optional[int] = None

class BookingSchema(BookingCreateSchema):
    id: str
    commission_rate: float = 15.0
    commission_amount: int = 0
    fundi_earnings: int = 0
    status: str = "pending"
    created_at: str

class BookingStatusUpdateSchema(CamelModel):
    status: str  # pending, confirmed, in_progress, completed, cancelled

class UserSchema(CamelModel):
    id: str
    name: str
    email: str
    phone: str
    avatar: Optional[str] = None
    address: Optional[str] = None
    role: str = "client"  # client, fundi, owner
    fundi_id: Optional[str] = None

class UserRegisterSchema(CamelModel):
    name: str
    email: str
    phone: str
    password: str
    role: Optional[str] = "client"
    fundi_id: Optional[str] = None
    category: Optional[str] = None
    category_id: Optional[str] = None
    experience_years: Optional[int] = 3
    hourly_rate: Optional[int] = 1500
    estimated_price: Optional[int] = 2500
    national_id: Optional[str] = None
    location_name: Optional[str] = "Westlands, Nairobi"
    bio: Optional[str] = None
    skills: Optional[List[str]] = []

class UserLoginSchema(CamelModel):
    email: str
    password: str
    role: Optional[str] = None

class AuthTokenSchema(CamelModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSchema

class OwnerSummarySchema(CamelModel):
    total_gross_volume: int
    total_owner_commission: int
    total_fundi_payouts: int
    completed_bookings_count: int
    active_fundis_count: int
    commission_rate_percent: float

class CommissionUpdateSchema(CamelModel):
    rate_percent: float

class EarningsLogSchema(CamelModel):
    booking_id: str
    fundi_name: str
    category: str
    date: str
    amount: int
    commission_rate: float
    commission_amount: int
    fundi_earnings: int
    status: str

class ChatMessageCreateSchema(CamelModel):
    booking_id: Optional[str] = None
    fundi_id: str
    sender_id: str
    sender_role: str = "client"
    sender_name: str
    receiver_id: str
    text: str

class ChatMessageSchema(ChatMessageCreateSchema):
    id: str
    timestamp: str
    is_read: bool = False

class TrackingInfoSchema(CamelModel):
    id: str # booking_id
    booking_id: str
    fundi_id: str
    fundi_name: str
    fundi_lat: float
    fundi_lng: float
    client_lat: float
    client_lng: float
    status: str
    eta_minutes: int
    distance_km: float
    updated_at: str

class TrackingUpdateSchema(CamelModel):
    fundi_lat: Optional[float] = None
    fundi_lng: Optional[float] = None
    status: Optional[str] = None
    eta_minutes: Optional[int] = None
    distance_km: Optional[float] = None


