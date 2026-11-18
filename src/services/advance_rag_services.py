from langchain_groq import ChatGroq
import json #It provides functions to convert between JSON strings and Python objects.
from src.services.rag_service import search_chunksV2 , rerank_chunks


llm = ChatGroq(model='openai/gpt-oss-120b', temperature=0)

# Query Rewrting: Convert follow-up questions into standalone questions using conversation history.
# Manage Conversation History
def rewrite_question(question , chat_history):
    if len(chat_history) == 0:
        return question

    history=""

    for i in range(len(chat_history)):
        history += f"{chat_history[i]['role']}: {chat_history[i]['content']}\n"

        prompt = f"""
            Based on the conversation history, rewrite the latest question
            as a standalone question that can be understood independently.

            Do not answer the question.
            Return only the rewritten question.

            Conversation:
            {history}

            Latest question:
            {question}
        """

        response = llm.invoke(prompt)

        return response.content.strip()


# Query Expansion: One question can be expressed in multiple ways , We search using these variations to improve the chance of finding relevant chunks.
def expand_query(question):

    prompt = f"""
        You are a search query expansion assistant for an
        Indian legal research platform.

        Generate exactly 2 alternative search queries for
        the user's question.

        Rules:
        1. Preserve the original legal meaning.
        2. Include relevant legal terminology.
        3. Do not answer the question.
        4. Do not invent sections or case names.
        5. Return only a valid JSON array of strings.

        User Question:
        {question}

        Example output:
        [
            "constitutional right to privacy in India",
            "Article 21 protection of personal privacy"
        ]
    """

    response = llm.invoke(prompt)

    try:
        queries = json.loads(response.content) #json.loads() -> Converts a JSON string into a Python object ; json.load() -> Reads JSON data directly from a file
                                               #json.dumps() -> convert back to json string

        if not isinstance(queries, list): #Checking whether the converted object is actually a list.
            return []

        final_queries = []

        for i in range(len(queries)):

            if isinstance(queries[i], str):
                query = queries[i].strip()

                if query and query.lower() != question.lower():
                    final_queries.append(query)

        return final_queries[:2] #only two questions

    except (json.JSONDecodeError, TypeError):
        return []



def advanced_search(db, question, user_id, document_id=None):

    print("Inside Advacne Search...........")
    # 1. Generate alternative queries
    expanded_queries = expand_query(question)

    # 2. Combine original and expanded queries
    queries = [question]

    for i in range(len(expanded_queries)):
        queries.append(expanded_queries[i])

    # 3. Search using all queries
    all_results = []

    for i in range(len(queries)):

        results = search_chunksV2( 
            db,
            queries[i],
            user_id,
            document_id
        )

        for j in range(len(results)):
            all_results.append(results[j])

    # 4. Remove duplicate chunks : Deduplication check
    unique_results = {}

    for i in range(len(all_results)):

        chunk_id = all_results[i]["chunk_id"]

        if chunk_id not in unique_results:
            unique_results[chunk_id] = all_results[i]

    candidates = list(unique_results.values())

    if not candidates:
        return []

    # 5. Rerank all candidates against the original question
    reranked_results = rerank_chunks(
        question,
        candidates
    )

    # 6. Filter low-relevance results
    relevant_results = []

    for i in range(len(reranked_results)):

        if reranked_results[i]["rerank_score"] >= 0.35:
            relevant_results.append(reranked_results[i])

    return relevant_results[:5] #top 5


def build_context(search_results):

    context = ""

    for i in range(len(search_results)):

        context += f"""
        DOCUMENT: {search_results[i]["filename"]}

        PAGE NUMBER: {search_results[i]["page_number"]}

        LEGAL TEXT:
        {search_results[i]["content"]}

        ----------------------------------
        """

    return context
