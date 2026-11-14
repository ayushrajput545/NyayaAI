from langchain_community.document_loaders import PyPDFLoader
from src.services.document_service import get_document_path
from langchain_text_splitters import RecursiveCharacterTextSplitter
from src.models.document_chunk import DocumentChunk
from langchain_huggingface import HuggingFaceEmbeddings



embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


# Indexing Phase
def indexingPhase(db, document):

    #1. Load the PDF already saved by the upload endpoint
    pdf_path = get_document_path(document.storage_key)

    loader = PyPDFLoader(str(pdf_path))
    docs = loader.load()

    #2. Split PDF into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_documents(docs) #it contains list : chunks = [chunk1 , chunk2 , chunk3]

    #3. Generate embeddings
    texts = []
    for chunk in chunks:
        texts.append(chunk.page_content)
    embeddings = embedding_model.embed_documents(texts)


    # Save chunks and embedding in PostgreSQL(pgvector)
    for index, chunk in enumerate(chunks):

        chunk_record = DocumentChunk(
            document_id=document.id,
            chunk_index=index,
            content=chunk.page_content,
            page_number=chunk.metadata.get("page", 0) + 1,
            chunk_metadata=chunk.metadata,
            embedding=embeddings[index]  #pg vector coloumn
        )
        db.add(chunk_record)

    document.page_count = len(docs)
    document.status = "processed"

    db.commit()
    return len(chunks)

