from fastapi import FastAPI , Depends , HTTPException , APIRouter
from sqlalchemy.orm import Session
from src.config.db import get_db
from src.models.conversation import Conversation
from src.models.message import Message
from src.models.user import User
from src.core.dependencies import get_current_user

conversation_routes = APIRouter(prefix='/conversations/api/v1')


# Get all conversation from user id only
@conversation_routes.get('/get-conversations')
def get_conversations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conversations = db.query(Conversation).filter(Conversation.user_id == current_user.id).order_by(Conversation.updated_at.desc()).all()

    result = []

    for i in range(len(conversations)):
        conversation = conversations[i]
        result.append({
            "conversation_id": str(conversation.id),
            "title": conversation.title,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at
        })

    return result


# get message of that comnversation
@conversation_routes.get("/{conversation_id}")
def get_conversation(conversation_id: int,  db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(
        Message.created_at.asc()
    ).all()

    result = []

    for i in range(len(messages)):

        result.append({
            "message_id": str(messages[i].id),
            "role": messages[i].role,
            "content": messages[i].content,
            "created_at": messages[i].created_at
        })

    return {
        "conversation_id": str(conversation.id),
        "title": conversation.title,
        "messages": result
    }


@conversation_routes.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).delete(synchronize_session=False)

    db.delete(conversation)
    db.commit()

    return {
        "message": "Conversation deleted successfully"
    }