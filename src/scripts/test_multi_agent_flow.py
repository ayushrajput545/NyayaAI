from src.agents.legal_research_graph import legal_research_graph
from src.config.db import LocalSession


db = LocalSession()

try:

    result = legal_research_graph.invoke({

        "question": "What are the fundamental rights under the Indian Constitution?",
        # "question":"Who is Ayush Rajput?",

        "user_id": 1,

        "document_id": None,

        "db": db,

        "chat_history": [],

        "search_question": "",

        "results": [],

        "context": "",

        "answer": "",

        "verification_result": ""
    })

    print(result["answer"])

    print("Verification:", result["verification_result"])

finally:
    db.close()