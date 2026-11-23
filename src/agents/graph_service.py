from src.models import Conversation , Message
from src.agents.legal_research_graph import legal_research_graph

def ask_question_with_graph(
    db,
    question,
    user_id,
    conversation_id=None,
    document_id=None,
    use_my_doc=False,
):

    print("Executing Multi-Agent Flow........")
    # Find existing conversation or create new one
    if conversation_id:

        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        ).first()

        if conversation is None:
            return None

    else:

        conversation = Conversation(
            user_id=user_id,
            title=question[:255]
        )

        db.add(conversation)
        db.flush()

    # Get previous messages
    previous_messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.desc())
        .limit(10)
        .all()
    )

    previous_messages.reverse()

    chat_history = []

    for i in range(len(previous_messages)):
        chat_history.append({
            "role": previous_messages[i].role,
            "content": previous_messages[i].content
        })

    # Save current user question
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=question
    )

    db.add(user_message)

    # Run LangGraph
    graph_result = legal_research_graph.invoke({

        "question": question,
        "user_id": user_id,
        "document_id": document_id,
        "use_my_doc": use_my_doc,
        "db": db,
        "chat_history": chat_history,

        "search_question": "",
        "results": [],
        "context": "",
        "answer": "",
        "verification_result": ""
    })

    answer = graph_result["answer"]
    results = graph_result["results"]

    # Save assistant response
    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=answer
    )

    db.add(assistant_message)
    db.commit()

    return {
        "conversation_id": str(conversation.id),
        "question": question,
        "answer": answer,
        "sources": results
    }
