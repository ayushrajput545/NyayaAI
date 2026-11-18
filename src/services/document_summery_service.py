
from src.models.document import Document
from src.models.document_chunk import DocumentChunk
from langchain_groq import ChatGroq

from sqlalchemy.orm import Session
from sqlalchemy import or_

llm = ChatGroq(model='openai/gpt-oss-120b', temperature=0)

def create_chunk_groups(chunks, max_chars=12000):

    groups = []
    current_group = ""
    
    for i in range(len(chunks)):

        chunk_text = f"""
        Page: {chunks[i].page_number}
        Content: {chunks[i].content}
        """

        # Start a new group if the size limit is reached
        if len(current_group) + len(chunk_text) > max_chars:

            if current_group:
                groups.append(current_group)

            current_group = chunk_text

        else:
            current_group += chunk_text

    # Add the remaining content
    if current_group:
        groups.append(current_group)

    return groups


def summarize_document(db: Session, document_id, user_id):

    # 1. Check whether the document exists and is accessible
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            or_(
                Document.uploaded_by == user_id,
                Document.uploaded_by == 3
            )
        )
        .first()
    )

    if document is None:
        return None

    # 2. Retrieve all chunks belonging to this document
    chunks = (
        db.query(DocumentChunk)
        .filter(
            DocumentChunk.document_id == document_id
        )
        .order_by(DocumentChunk.chunk_index.asc())
        .all()
    )

    if not chunks:
        return None

    # 3. Divide chunks into manageable groups
    chunk_groups = create_chunk_groups(chunks)

    # 4. MAP: Generate an intermediate summary for each group
    intermediate_summaries = []

    for i in range(len(chunk_groups)):

        prompt = f"""
        You are an expert legal document analysis assistant.

        Analyze the following portion of an Indian legal document.

        Extract and summarize:
        1. Important facts
        2. Legal issues
        3. Arguments of the parties
        4. Relevant laws and sections
        5. Court's reasoning
        6. Important observations and decisions

        Instructions:
        - Use only the provided document content.
        - Do not invent facts, sections, dates or judgments.
        - Preserve important legal details.
        - If information is not available, do not assume it.
        - Mention page numbers wherever possible.

        Document: {document.filename}

        Document portion:
        {chunk_groups[i]}
        """

        response = llm.invoke(prompt)

        intermediate_summaries.append(response.content)

    # 5. REDUCE: Combine intermediate summaries
    combined_summaries = ""

    for i in range(len(intermediate_summaries)):
        combined_summaries += f"""
        Part {i + 1}:
        {intermediate_summaries[i]}
        """

    final_prompt = f"""
    You are an expert Indian legal research assistant.

    Generate a comprehensive, structured summary of the legal document
    using the intermediate summaries provided below.

    Use the following structure:

    1. Case Overview
    2. Facts of the Case
    3. Legal Issues
    4. Arguments of the Parties
    5. Relevant Laws and Constitutional Provisions
    6. Court's Reasoning
    7. Final Judgment and Decision

    Instructions:
    - Use only the information in the provided summaries.
    - Do not invent legal facts or conclusions.
    - Preserve important legal terminology.
    - Clearly distinguish arguments from the court's findings.
    - If any section lacks information, mention that it was not
      available in the provided content.
    - Write in clear, understandable language.

    Document: {document.filename}

    Intermediate summaries:
    {combined_summaries}
    """

    final_response = llm.invoke(final_prompt)

    return final_response.content
