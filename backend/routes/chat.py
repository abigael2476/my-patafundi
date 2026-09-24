import datetime
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import ChatMessageModel, FundiModel
from schemas import ChatMessageSchema, ChatMessageCreateSchema

router = APIRouter(tags=["Chat"])

AUTO_REPLIES = [
    "Habari! I am on my way to your location with all the required tools.",
    "Asante! I have received your message. I'm navigating through traffic right now.",
    "Niko njiani! I should be arriving at your place shortly.",
    "Thank you for confirming. See you in a few minutes!",
    "Understood. If you need anything else before I arrive, just message me here."
]

@router.get("/chat/{fundi_id}", response_model=List[ChatMessageSchema])
def get_chat_history(
    fundi_id: str,
    booking_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ChatMessageModel).filter(ChatMessageModel.fundi_id == fundi_id)
    if booking_id:
        query = query.filter(ChatMessageModel.booking_id == booking_id)
    
    messages = query.order_by(ChatMessageModel.timestamp.asc()).all()
    
    # Seed initial welcome message if no history exists yet
    if not messages:
        fundi = db.query(FundiModel).filter(FundiModel.id == fundi_id).first()
        fundi_name = fundi.name if fundi else "Fundi"
        
        initial_msg = ChatMessageModel(
            id=f"MSG-{int(datetime.datetime.now().timestamp() * 1000)}",
            booking_id=booking_id,
            fundi_id=fundi_id,
            sender_id=fundi_id,
            sender_role="fundi",
            sender_name=fundi_name,
            receiver_id="current_user",
            text=f"Jambo! I am {fundi_name}. How can I assist you with your service today?",
            timestamp=datetime.datetime.now().strftime("%I:%M %p"),
            is_read=True
        )
        db.add(initial_msg)
        db.commit()
        db.refresh(initial_msg)
        messages = [initial_msg]
        
    return messages

@router.post("/chat/send", response_model=ChatMessageSchema)
def send_chat_message(
    msg: ChatMessageCreateSchema,
    auto_reply: bool = Query(False),
    db: Session = Depends(get_db)
):
    now_str = datetime.datetime.now().strftime("%I:%M %p")
    new_msg = ChatMessageModel(
        id=f"MSG-{int(datetime.datetime.now().timestamp() * 1000)}",
        booking_id=msg.booking_id,
        fundi_id=msg.fundi_id,
        sender_id=msg.sender_id,
        sender_role=msg.sender_role,
        sender_name=msg.sender_name,
        receiver_id=msg.receiver_id,
        text=msg.text,
        timestamp=now_str,
        is_read=True
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    # Auto-generate Fundi reply if sent by client
    if auto_reply and msg.sender_role == "client":
        fundi = db.query(FundiModel).filter(FundiModel.id == msg.fundi_id).first()
        fundi_name = fundi.name if fundi else "Fundi"
        
        reply_text = random.choice(AUTO_REPLIES)
        reply_msg = ChatMessageModel(
            id=f"MSG-{int(datetime.datetime.now().timestamp() * 1000) + 1}",
            booking_id=msg.booking_id,
            fundi_id=msg.fundi_id,
            sender_id=msg.fundi_id,
            sender_role="fundi",
            sender_name=fundi_name,
            receiver_id=msg.sender_id,
            text=reply_text,
            timestamp=datetime.datetime.now().strftime("%I:%M %p"),
            is_read=False
        )
        db.add(reply_msg)
        db.commit()

    return new_msg
