from langchain_core.prompts import ChatPromptTemplate
from src.services.advance_rag_services import advanced_search


#Query Unserstanding AGENT
QUERY_UNDERSTANDING_PROMPT = ChatPromptTemplate.from_messages([
    {
        "role": "system",
        "content": """
        You are a Legal Query Understanding Agent.

        Your task is to understand the user's current legal question
        using the previous conversation history.

        Rules:
        1. Convert follow-up questions into standalone questions.
        2. Preserve the original legal intent.
        3. Resolve references such as "this Act", "that judgment",
           and "what about Section 21?" using conversation history.
        4. Do not answer the legal question.
        5. Return only the rewritten standalone question.
        """
    },
    {
        "role": "user",
        "content": """
        Conversation History:
        {chat_history}

        Current Question:
        {question}

        Rewrite the question now.
        """
    }
])

def query_understanding_agent(llm , question:str , chat_history:list):
    chain = QUERY_UNDERSTANDING_PROMPT | llm
    results = chain.invoke({
        "question": question,
        "chat_history": chat_history
    })
    return results.content.strip()


# LEGAL Research Agent
def legal_research_agent(
    db,
    question: str,
    user_id,
    document_id=None,
    use_my_doc: bool = False,
):
    results = advanced_search(
        db, question, user_id, document_id, use_my_doc
    )  # Query expansion -> BM25 Keyword Search -> Vector Search -> Deduplication -> Reranking
    return results


# Legal Context Agent
def legal_context_agent(results: list):

    context = ""

    for i in range(len(results)):

        context += f"""
        Document: {results[i]['filename']}
        Page: {results[i]['page_number']}
        Content: {results[i]['content']}
        """

    return context



# Legal Analysis Agent
LEGAL_ANALYSIS_PROMPT = ChatPromptTemplate.from_messages([
    {
        "role": "system",
        "content": """
        You are an Indian Legal Analysis Agent.

        Your task is to answer legal questions using the
        retrieved legal document context.

        Rules:
        1. Use only the provided legal context as evidence.
        2. Do not invent legal facts, sections, cases or judgments.
        3. Explain legal concepts in clear and simple language.
        4. Distinguish between court observations and final decisions.
        5. Mention document names and page numbers where available.
        6. If the context does not contain sufficient information,
           clearly state the limitation.
        7. Use the same language as the user's question.
        """
    },
    {
        "role": "user",
        "content": """
        Conversation History:
        {chat_history}

        Question:
        {question}

        Retrieved Legal Context:
        {context}

        Generate the legal answer now.
        """
    }
])


def legal_analysis_agent(
    llm,
    question: str,
    context: str,
    chat_history: list,
    use_my_doc: bool = False,
):

    chain = LEGAL_ANALYSIS_PROMPT | llm

    result = chain.invoke({
        "question": question,
        "context": context,
        "chat_history": [] if use_my_doc else chat_history,
    })

    return result.content


# ==========================================
# EVIDENCE VERIFICATION AGENT
# ==========================================

EVIDENCE_VERIFICATION_PROMPT = ChatPromptTemplate.from_messages([
    {
        "role": "system",
        "content": """
        You are an independent Legal Evidence Verification Agent.

        Your responsibility is to verify whether the generated
        legal answer is supported by the retrieved evidence.

        Verification rules:

        1. Compare the answer against all retrieved sources.
        2. Accept information supported by any retrieved source.
        3. Accept reasonable paraphrasing.
        4. Do not require every detail of the answer to appear
           in a single document.
        5. Reject fabricated legal provisions or judgments.
        6. Reject materially incorrect legal claims.
        7. If the main claims are supported, return PASS.
        8. If important claims are unsupported, return FAIL.

        Do not use external knowledge.

        Return exactly PASS or FAIL.
        """
    },
    {
        "role": "user",
        "content": """
        Retrieved Legal Context:
        {context}

        Generated Answer:
        {answer}

        Verify the answer.
        """
    }
])


def evidence_verification_agent(
    llm,
    context: str,
    answer: str
):

    chain = EVIDENCE_VERIFICATION_PROMPT | llm

    result = chain.invoke({
        "context": context,
        "answer": answer
    })

    verification_result = result.content.strip().upper()

    if verification_result.startswith("PASS"):
        return "PASS"

    return "FAIL"


# ==========================================
# FALLBACK AGENT
# ==========================================

def fallback_agent():

    return (
        "I couldn't generate a sufficiently supported answer "
        "from the available legal documents. Please try another "
        "question or upload relevant legal documents."
    )
