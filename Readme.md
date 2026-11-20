# ⚖️ NyayaAI — Indian Legal Research & Document Intelligence Platform

<p align="center">
  <strong>An AI-powered legal research assistant built for Indian legal documents.</strong>
  <br/>
  Multilingual RAG · Hybrid Search · Multi-Agent AI · Legal Document Intelligence
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13-blue?logo=python" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi" />
  <img src="https://img.shields.io/badge/Next.js-Frontend-black?logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql" />
  <img src="https://img.shields.io/badge/pgvector-Vector_Search-4169E1" />
  <img src="https://img.shields.io/badge/LangGraph-Multi_Agent-orange" />
  <img src="https://img.shields.io/badge/RAGAS-Evaluation-purple" />
  <img src="https://img.shields.io/badge/Groq-LLM-black" />
</p>

---

## 📌 Table of Contents

1. [Introduction](#-introduction)
2. [Application Walkthrough](#-application-walkthrough)
3. [Problem Statement](#-problem-statement)
4. [Key Features](#-key-features)
5. [Technology Stack](#-technology-stack)
6. [System Architecture](#-system-architecture)
7. [Application Workflow](#-application-workflow)
8. [RAG Pipeline](#-rag-pipeline)
9. [Hybrid Search Architecture](#-hybrid-search-architecture)
10. [Advanced RAG Techniques](#-advanced-rag-techniques)
11. [Multi-Agent Legal Research System](#-multi-agent-legal-research-system)
12. [Legal Document Summarization](#-legal-document-summarization)
13. [RAG Evaluation with RAGAS](#-rag-evaluation-with-ragas)
14. [Database Architecture](#-database-architecture)
15. [Authentication and Authorization](#-authentication-and-authorization)
16. [Backend API Endpoints](#-backend-api-endpoints)
17. [Frontend Architecture](#-frontend-architecture)
18. [Project Structure](#-project-structure)
19. [Installation and Setup](#-installation-and-setup)
20. [Docker Setup](#-docker-setup)
21. [Environment Variables](#-environment-variables)
22. [Evaluation Results](#-evaluation-results)
23. [Dataset](#-dataset)
24. [Future Improvements](#-future-improvements)
25. [Learning Resources and References](#-learning-resources-and-references)

---

# 🚀 Introduction

**NyayaAI** is an AI-powered Indian Legal Research and Document Intelligence Platform designed to simplify legal research using Retrieval-Augmented Generation (RAG), hybrid information retrieval, and multi-agent AI workflows.

The platform allows users to upload legal documents, ask questions in natural language, retrieve relevant legal provisions and judgments, and receive AI-generated answers grounded in the uploaded documents.

Unlike a basic chatbot that generates answers from its general knowledge, NyayaAI retrieves relevant passages from legal documents before generating an answer.

The platform supports:

- Indian Supreme Court judgments.
- Indian constitutional provisions.
- Bharatiya Nyaya Sanhita (BNS), 2023.
- Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.
- Bharatiya Sakshya Adhiniyam (BSA), 2023.
- User-uploaded legal PDFs.
- English and Hindi legal queries.
- Conversational legal research.
- Document summarization.
- Multi-agent legal research workflows.

The project combines traditional keyword retrieval, semantic vector search, reranking, query expansion, and LangGraph-based agent orchestration to build a more capable legal research system.

> **Disclaimer:** NyayaAI is an experimental legal research assistant, not a substitute for professional legal advice. Its outputs should be verified against the original legislation, judgments, and qualified legal professionals.

---

# 🎥 Application Walkthrough

This section is reserved for the complete application demonstration.

### Full Application Walkthrough

<!-- Replace the placeholder below with your YouTube video URL -->

**Video:** [Add NyayaAI Application Walkthrough Here](YOUR_APPLICATION_WALKTHROUGH_VIDEO_URL)

The walkthrough should demonstrate:

1. User registration and email verification.
2. Login and authentication.
3. Dashboard navigation.
4. Uploading legal PDF documents.
5. Document processing and indexing.
6. Asking questions using Normal RAG Mode.
7. Asking questions using Research Agent Mode.
8. Viewing retrieved sources and page references.
9. Generating document summaries.
10. Managing conversation history.

### Code Walkthrough

<!-- Replace the placeholder below with your YouTube video URL -->

**Video:** [Add NyayaAI Complete Code Walkthrough Here](YOUR_CODE_WALKTHROUGH_VIDEO_URL)

The code walkthrough should cover:

1. Backend architecture and FastAPI routes.
2. PostgreSQL and pgvector database design.
3. PDF ingestion and text chunking.
4. Multilingual embedding generation.
5. Hybrid retrieval implementation.
6. RRF and cross-encoder reranking.
7. Advanced RAG and query expansion.
8. LangGraph multi-agent implementation.
9. RAGAS evaluation framework.
10. Next.js frontend architecture.
11. Docker configuration.

---

# ❓ Problem Statement

Traditional legal research involves searching through lengthy judgments, statutes, and legal documents to find relevant information.

Some common challenges include:

- Large volumes of legal documents.
- Time-consuming manual research.
- Difficulty identifying relevant paragraphs and provisions.
- Keyword-based search failing to understand semantic meaning.
- Legal terminology and contextual complexity.
- Difficulty connecting information across multiple documents.
- Risk of AI-generated answers containing unsupported information.

NyayaAI addresses these challenges through a document-grounded AI research workflow.

### Proposed Solution

Instead of directly asking an LLM to answer legal questions, NyayaAI follows this process:

1. Upload and process legal documents.
2. Extract text from PDF pages.
3. Divide documents into smaller chunks.
4. Generate multilingual embeddings.
5. Store chunks and embeddings in PostgreSQL with pgvector.
6. Retrieve relevant passages using hybrid search.
7. Rerank retrieved passages using a cross-encoder.
8. Generate answers using Groq.
9. Return relevant document sources and page references.

---

# ✨ Key Features

| Feature | Description |
|---|---|
| PDF Upload | Upload and manage legal PDF documents. |
| Document Ingestion | Extract, clean, split, and index PDF content. |
| Multilingual Embeddings | Search legal content in English and Hindi. |
| Semantic Search | Retrieve passages based on meaning. |
| BM25 Search | Retrieve passages based on keyword relevance. |
| Hybrid Search | Combine semantic and keyword retrieval. |
| Reciprocal Rank Fusion | Combine multiple retrieval rankings. |
| Cross-Encoder Reranking | Improve relevance of retrieved passages. |
| Query Expansion | Generate alternative search queries. |
| Conversational RAG | Maintain context across multiple questions. |
| Source References | Provide document names and page references. |
| Multi-Agent Research | Coordinate specialized legal research agents. |
| Document Summarization | Generate structured summaries of uploaded documents. |
| RAGAS Evaluation | Evaluate faithfulness and answer relevancy. |
| Authentication | JWT-based authentication and protected APIs. |
| Conversation Management | Create, retrieve, and delete conversations. |

---

# 🛠️ Technology Stack

## Backend

| Technology | Purpose |
|---|---|
| Python 3.13 | Primary backend language |
| FastAPI | REST API development |
| SQLAlchemy 2.x | ORM and database operations |
| Alembic | Database migrations |
| PostgreSQL | Relational database |
| pgvector | Vector similarity search |
| Psycopg 3 | PostgreSQL driver |
| LangChain | LLM and RAG integrations |
| LangGraph | Multi-agent workflow orchestration |
| LangChain-Groq | Groq LLM integration |
| Sentence Transformers | Multilingual embeddings |
| HuggingFace | Embedding model integration |
| PyPDF | PDF text extraction |
| BM25 | Keyword-based retrieval |
| Cross-Encoder | Search result reranking |
| RAGAS | RAG evaluation |
| PyJWT | JWT authentication |
| pwdlib + Argon2 | Secure password hashing |

## Frontend

| Technology | Purpose |
|---|---|
| Next.js | React-based frontend framework |
| TypeScript | Type-safe application development |
| React | Component-based UI |
| Tailwind CSS | Styling and responsive UI |

## AI and Machine Learning

| Technology | Purpose |
|---|---|
| Groq | LLM inference |
| GPT-OSS-120B | Answer generation and agent reasoning |
| Sentence Transformers | Text embeddings |
| BM25 | Lexical retrieval |
| Reciprocal Rank Fusion | Retrieval result fusion |
| Cross-Encoder | Context reranking |
| LangGraph | Agent workflow orchestration |
| RAGAS | RAG quality evaluation |

### LLM Configuration

NyayaAI uses Groq as its LLM provider.

```python
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0
)
```

### Embedding Model

```python
from langchain_huggingface import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)
```

The selected embedding model generates 384-dimensional embeddings and supports multilingual semantic retrieval.

---

# 🏗️ System Architecture

NyayaAI follows a layered architecture.

```mermaid
flowchart TB
    U["User"] --> FE["Frontend - Next.js + TypeScript"]
    FE --> API["FastAPI Backend"]
    
    API --> AUTH["Authentication Layer"]
    API --> DOC["Document Management"]
    API --> CHAT["Conversation Management"]
    API --> RAG["RAG Services"]
    API --> AGENT["LangGraph Multi-Agent System"]
    
    AUTH --> DB["PostgreSQL + pgvector"]
    DOC --> ING["PDF Ingestion Pipeline"]
    ING --> EMB["Multilingual Embeddings"]
    EMB --> DB
    
    RAG --> RET["Hybrid Retrieval"]
    RET --> BM["BM25 Search"]
    RET --> VS["Vector Search"]
    BM --> RRF["Reciprocal Rank Fusion"]
    VS --> RRF
    RRF --> RR["Cross-Encoder Reranking"]
    RR --> LLM["Groq LLM"]
    
    AGENT --> LG["Legal Research Graph"]
    LG --> RAG
    
    LLM --> DB
    LG --> DB
    DB --> API
    API --> FE
```

### Architecture Layers

**1. Presentation Layer**

- Next.js frontend.
- TypeScript.
- Authentication screens.
- Document dashboard.
- AI chat interface.
- Research mode selector.

**2. API Layer**

- FastAPI routes.
- Request validation.
- JWT authentication.
- User authorization.

**3. Service Layer**

- Document services.
- RAG services.
- Conversation services.
- LLM services.
- Multi-agent services.

**4. AI Layer**

- Embedding generation.
- Hybrid search.
- Reranking.
- Query expansion.
- LLM response generation.
- Agent orchestration.

**5. Data Layer**

- PostgreSQL.
- pgvector.
- Document metadata.
- Document chunks.
- Embeddings.
- Conversations and messages.

---

# 🔄 Application Workflow

The following diagram represents the complete document-to-answer workflow.

```mermaid
flowchart TD
    A["User Opens Application"] --> B["Register / Login"]
    B --> C["JWT Authentication"]
    C --> D["Dashboard"]
    
    D --> E["Upload Legal PDF"]
    E --> F["Validate PDF"]
    F --> G["Save PDF to Storage"]
    G --> H["Save Document Metadata"]
    H --> I["Extract PDF Text"]
    I --> J["Split Text into Chunks"]
    J --> K["Generate Embeddings"]
    K --> L["Store Chunks + Vectors"]
    
    D --> M["Ask Legal Question"]
    M --> N{"Select Research Mode"}
    
    N -->|"Normal RAG"| O["Advanced RAG Pipeline"]
    N -->|"Research Agent"| P["LangGraph Workflow"]
    
    O --> Q["Retrieve Relevant Context"]
    P --> Q
    
    Q --> R["Generate Answer"]
    R --> S["Return Sources and Page Numbers"]
    S --> T["Save Conversation"]
    T --> U["Display Answer"]
```

---

# 📚 RAG Pipeline

Retrieval-Augmented Generation (RAG) is the core of NyayaAI.

RAG combines information retrieval with language model generation.

Instead of relying only on the LLM's internal knowledge, the system retrieves relevant passages from the legal document collection and uses those passages as context.

### RAG Workflow

```mermaid
flowchart TD
    A["User Question"] --> B["Question Processing"]
    B --> C["Generate Query Embedding"]
    C --> D["Retrieve Relevant Chunks"]
    D --> E["Build Context"]
    E --> F["Groq LLM"]
    F --> G["Generate Grounded Answer"]
    G --> H["Return Answer + Sources"]
```

### Step 1: PDF Ingestion

The user uploads a legal PDF.

The backend:

- Validates the PDF file.
- Checks the file size and MIME type.
- Generates a unique storage key.
- Computes the SHA256 hash.
- Saves document metadata.
- Stores the PDF in local storage.

### Step 2: PDF Text Extraction

NyayaAI uses `PyPDFLoader` to extract text from PDF pages.

```python
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader(pdf_path)
documents = loader.load()
```

Each extracted page contains:

- Page content.
- Source document metadata.
- Page number metadata.

### Step 3: Text Chunking

Large legal documents are divided into smaller chunks.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

chunks = splitter.split_documents(documents)
```

Current configuration:

| Parameter | Value |
|---|---:|
| Chunk Size | 500 characters |
| Chunk Overlap | 50 characters |
| Embedding Dimensions | 384 |

Chunk overlap helps preserve contextual continuity between adjacent chunks.

### Step 4: Embedding Generation

Each chunk is converted into a numerical vector.

The vectors represent semantic information about the text.

NyayaAI uses:

`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`

### Step 5: Vector Storage

The generated vectors are stored in PostgreSQL using pgvector.

```python
from pgvector.sqlalchemy import Vector

embedding = Vector(384)
```

### Step 6: Question Embedding

When a user asks a question, the same embedding model converts the question into a vector.

The system then compares the question vector with stored document vectors.

### Step 7: Context Retrieval

The most relevant document chunks are retrieved and passed to the LLM.

### Step 8: Answer Generation

Groq generates an answer using the retrieved context.

The prompt instructs the LLM to:

- Use only the provided legal context.
- Avoid inventing legal facts.
- Mention source documents and page numbers.
- Respond in the language of the question.
- Clearly communicate when sufficient information is unavailable.

---

# 🔍 Hybrid Search Architecture

A major component of NyayaAI is its hybrid retrieval system.

Traditional vector search is good at semantic similarity, while keyword search is useful for exact legal terminology, section numbers, article numbers, and statutory references.

Combining both approaches helps retrieve relevant legal passages.

### 1. BM25 Keyword Search

BM25 is a ranking algorithm used in information retrieval.

It evaluates the relevance of a document based on the occurrence and distribution of query terms.

Example:

Query:

`Section 66A Information Technology Act`

BM25 can prioritize passages containing exact references to Section 66A.

### 2. Vector Semantic Search

Vector search compares embeddings using cosine similarity.

It can retrieve conceptually relevant passages even when the exact wording differs.

Example:

Query:

`Why was online speech restricted under Section 66A?`

Semantic search can retrieve passages discussing vagueness, free speech, and constitutional restrictions.

### 3. Reciprocal Rank Fusion (RRF)

RRF combines ranked results from different retrieval methods.

The formula is:

\[
RRF(d)=\sum_{r \in R}\frac{1}{k+rank_r(d)}
\]

Where:

- \(d\) = retrieved document chunk.
- \(R\) = retrieval result lists.
- \(rank_r(d)\) = rank of the chunk in a result list.
- \(k\) = ranking constant, commonly 60.

RRF helps combine BM25 and vector search without requiring their raw scores to be directly comparable.

### 4. Cross-Encoder Reranking

After hybrid retrieval, candidate chunks are reranked using a cross-encoder.

Unlike bi-encoder retrieval, a cross-encoder processes the query and candidate passage together to estimate their relevance.

```mermaid
flowchart TD
    A["User Query"] --> B["Hybrid Retrieval"]
    B --> C["BM25 Results"]
    B --> D["Vector Search Results"]
    C --> E["Reciprocal Rank Fusion"]
    D --> E
    E --> F["Candidate Chunks"]
    F --> G["Cross-Encoder Reranker"]
    G --> H["Relevance Filtering"]
    H --> I["Top 5 Context Chunks"]
```

### Retrieval Pipeline Summary

| Stage | Technique |
|---|---|
| Keyword Retrieval | BM25 |
| Semantic Retrieval | pgvector cosine similarity |
| Result Combination | Reciprocal Rank Fusion |
| Reranking | Cross-Encoder |
| Final Context | Top 5 relevant chunks |

---

# 🧠 Advanced RAG Techniques

NyayaAI extends basic RAG through additional retrieval and query-processing techniques.

### 1. Query Rewriting

A user's question may depend on earlier conversation messages.

Query rewriting converts a follow-up question into a standalone question.

Example:

Previous question:

`What is Section 66A?`

Follow-up:

`Why was it unconstitutional?`

Rewritten question:

`Why was Section 66A of the Information Technology Act, 2000 declared unconstitutional by the Supreme Court?`

### 2. Query Expansion

Query expansion generates alternative search queries to improve retrieval coverage.

Example:

Original query:

`Why was Section 66A struck down?`

Alternative queries:

- Constitutional validity of Section 66A.
- Shreya Singhal judgment and freedom of speech.
- Vagueness and chilling effect of Section 66A.

NyayaAI uses Groq to generate two alternative queries.

### 3. Multi-Query Retrieval

The original question and expanded queries are passed through the hybrid retrieval pipeline.

Their results are combined, and duplicate chunks are removed.

### 4. Relevance Filtering

Retrieved chunks are reranked against the original user question.

A relevance threshold is applied before selecting the final context.

Current threshold:

`rerank_score >= 0.35`

### Advanced RAG Workflow

```mermaid
flowchart TD
    A["User Question"] --> B["Conversation History"]
    B --> C["Query Rewriting"]
    C --> D["Query Expansion"]
    
    D --> E["Original Query"]
    D --> F["Alternative Query 1"]
    D --> G["Alternative Query 2"]
    
    E --> H["Hybrid Search"]
    F --> H
    G --> H
    
    H --> I["Merge Results"]
    I --> J["Remove Duplicate Chunks"]
    J --> K["Cross-Encoder Reranking"]
    K --> L["Relevance Threshold"]
    L --> M["Top 5 Context Chunks"]
    M --> N["LLM Answer Generation"]
```

---

# 🤖 Multi-Agent Legal Research System

NyayaAI includes a LangGraph-based multi-agent legal research workflow.

The objective is to divide the legal research process into specialized responsibilities instead of relying on a single LLM call.

The system uses six specialized agents.

### Agent Architecture

```mermaid
flowchart TD
    A["User Legal Question"] --> B["Query Understanding Agent"]
    
    B --> C["Legal Research Agent"]
    C --> D{"Relevant Documents Found?"}
    
    D -->|"No"| I["Fallback Agent"]
    D -->|"Yes"| E["Legal Context Agent"]
    
    E --> F["Legal Analysis Agent"]
    F --> G["Evidence Verification Agent"]
    
    G --> H{"Verification Result"}
    
    H -->|"PASS"| J["Return Legal Answer"]
    H -->|"FAIL"| I
    
    I --> K["Return Cautious Fallback"]
```

### 1. Query Understanding Agent

**Responsibility:** Understand the user's question and rewrite it into a research-ready query.

Tasks:

- Interpret the user's intent.
- Use conversation history.
- Resolve ambiguous follow-up questions.
- Produce a standalone research query.

### 2. Legal Research Agent

**Responsibility:** Retrieve relevant legal documents.

It calls the existing advanced retrieval service.

```python
advanced_search(
    db,
    question,
    user_id,
    document_id
)
```

The existing retrieval implementation is reused rather than rebuilding the RAG pipeline.

### 3. Legal Context Agent

**Responsibility:** Prepare retrieved evidence for the analysis stage.

Tasks:

- Organize retrieved passages.
- Preserve source filenames.
- Preserve page references.
- Format legal context.

### 4. Legal Analysis Agent

**Responsibility:** Generate a legal answer using retrieved evidence.

The agent uses Groq and receives the prepared legal context.

### 5. Evidence Verification Agent

**Responsibility:** Check whether the generated answer is supported by the retrieved context.

It returns a verification decision:

- PASS: The answer is supported by the available evidence.
- FAIL: The answer is not sufficiently supported.

This is an LLM-based verification step, not a guarantee of legal correctness.

### 6. Fallback Agent

**Responsibility:** Handle situations where sufficient evidence is unavailable or verification fails.

It returns a cautious response instead of presenting unsupported legal information as fact.

### Multi-Agent Execution Summary

| Agent | Main Responsibility |
|---|---|
| Query Understanding | Query interpretation |
| Legal Research | Document retrieval |
| Legal Context | Context preparation |
| Legal Analysis | Answer generation |
| Evidence Verification | Evidence checking |
| Fallback | Safe response handling |

### Two Research Modes

NyayaAI provides two distinct answering workflows.

| Mode | Workflow |
|---|---|
| Normal RAG Mode | Existing advanced RAG pipeline |
| Research Agent Mode | LangGraph multi-agent workflow |

Both workflows reuse the existing retrieval infrastructure.

---

# 📄 Legal Document Summarization

NyayaAI provides document summarization for uploaded legal PDFs.

Long documents are divided into groups of chunks before summarization.

The system follows a Map-Reduce summarization approach.

### Map-Reduce Workflow

```mermaid
flowchart TD
    A["Uploaded Legal Document"] --> B["Retrieve Document Chunks"]
    B --> C["Create Chunk Groups"]
    
    C --> D["Map Summarization"]
    D --> E["Summary 1"]
    D --> F["Summary 2"]
    D --> G["Summary 3"]
    
    E --> H["Reduce Summarization"]
    F --> H
    G --> H
    
    H --> I["Final Structured Summary"]
```

### Map Phase

Each group of document chunks is summarized independently.

### Reduce Phase

The intermediate summaries are combined into a final structured summary.

The final summary is generated using Groq.

---

# 📊 RAG Evaluation with RAGAS

A RAG application should not be evaluated only by checking whether the generated answer looks correct.

NyayaAI uses **RAGAS** to evaluate the quality of its RAG responses.

RAGAS provides metrics that help measure how well the retrieval and generation components perform.

### Evaluation Metrics

#### 1. Faithfulness

Measures whether the generated answer is supported by the retrieved context.

A high faithfulness score indicates that the answer is grounded in the retrieved passages.

\[
Faithfulness \in [0,1]
\]

#### 2. Answer Relevancy

Measures whether the generated answer addresses the user's question.

A high answer relevancy score indicates that the response is relevant to the original question.

\[
Answer\ Relevancy \in [0,1]
\]

### RAGAS Evaluation Workflow

```mermaid
flowchart TD
    A["Legal Question Dataset"] --> B["Run RAG Pipeline"]
    B --> C["Generate Answer"]
    C --> D["Capture Retrieved Context"]
    
    D --> E["Create Evaluation Dataset"]
    
    E --> F["Faithfulness Evaluation"]
    E --> G["Answer Relevancy Evaluation"]
    
    F --> H["Calculate Scores"]
    G --> H
    
    H --> I["Average Metric Scores"]
    I --> J["Generate Evaluation Report"]
```

### Evaluation Dataset Format

Each evaluation sample contains:

```json
{
    "user_input": "What was Section 66A of the IT Act?",
    "response": "Section 66A was struck down by the Supreme Court...",
    "retrieved_contexts": [
        "Relevant passage extracted from the Shreya Singhal judgment..."
    ],
    "reference": "Verified reference answer..."
}
```

### Evaluation Implementation

The evaluation uses:

- RAGAS 0.4.3.
- Faithfulness metric.
- Answer Relevancy metric.
- Groq as the evaluation LLM.
- Multilingual Hugging Face embeddings for relevancy evaluation.

### Evaluation Dataset

The planned evaluation dataset contains 50 legal questions covering:

- Supreme Court judgments.
- Indian Constitution.
- Bharatiya Nyaya Sanhita.
- Bharatiya Nagarik Suraksha Sanhita.
- Bharatiya Sakshya Adhiniyam.

The first three questions have been evaluated with actual RAGAS execution.

The remaining questions should be evaluated by running the evaluation script before reporting a 50-question benchmark.

---

# 🗄️ Database Architecture

NyayaAI uses PostgreSQL as its primary database and pgvector for vector storage and similarity search.

The database contains eight primary application models, along with an email OTP model for verification.

### Database Tables

| Table | Responsibility |
|---|---|
| User | Stores user account information |
| LegalCase | Stores legal case information |
| Document | Stores uploaded document metadata |
| DocumentChunk | Stores extracted text and embeddings |
| Conversation | Stores user conversations |
| Message | Stores conversation messages |
| Citation | Stores citation records |
| DocumentJob | Stores document processing job information |
| EmailOTP | Stores email verification OTP information |

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ DOCUMENT : uploads
    USER ||--o{ CONVERSATION : creates
    USER ||--o{ EMAIL_OTP : verifies
    
    LEGAL_CASE ||--o{ DOCUMENT : contains
    DOCUMENT ||--o{ DOCUMENT_CHUNK : contains
    DOCUMENT ||--o{ DOCUMENT_JOB : processes
    
    CONVERSATION ||--o{ MESSAGE : contains
    MESSAGE ||--o{ CITATION : references
    
    USER {
        uuid id PK
        string full_name
        string email
        string password_hash
        boolean is_verified
        datetime created_at
    }
    
    DOCUMENT {
        uuid id PK
        string filename
        string storage_key
        string mime_type
        integer file_size
        string sha256
        string status
        integer uploaded_by
        uuid case_id FK
    }
    
    DOCUMENT_CHUNK {
        uuid id PK
        uuid document_id FK
        integer chunk_index
        text content
        integer page_number
        vector embedding
    }
    
    CONVERSATION {
        uuid id PK
        uuid user_id FK
        string title
        datetime created_at
    }
    
    MESSAGE {
        uuid id PK
        uuid conversation_id FK
        string role
        text content
        datetime created_at
    }
```

### Vector Search

The `DocumentChunk` table stores embeddings using pgvector.

Embedding dimension:

`384`

Similarity metric:

`Cosine Distance`

This allows PostgreSQL to perform semantic similarity search directly against stored legal document embeddings.

### Database Migrations

Alembic manages database schema migrations.

```powershell
alembic revision --autogenerate -m "migration_name"
alembic upgrade head
```

---

# 🔐 Authentication and Authorization

NyayaAI uses JWT-based authentication.

### Registration Workflow

```mermaid
flowchart TD
    A["User Registration"] --> B["Validate Input"]
    B --> C["Hash Password using Argon2"]
    C --> D["Create User"]
    D --> E["Generate Email OTP"]
    E --> F["Send Verification Email"]
    F --> G["Verify OTP"]
    G --> H["Activate Verified Account"]
```

### Login Workflow

```mermaid
flowchart TD
    A["Login Request"] --> B["Find User by Email"]
    B --> C["Verify Password"]
    C --> D{"Account Verified?"}
    D -->|"No"| E["Reject Login"]
    D -->|"Yes"| F["Generate JWT"]
    F --> G["Return Access Token"]
```

### Authentication Features

- Password hashing using Argon2.
- Email OTP verification.
- JWT access token authentication.
- Protected API routes.
- User ownership checks.
- Verified account requirement.
- 30-minute access token expiry.

---

# 🔌 Backend API Endpoints

Base URL:

`http://localhost:8080/api/v1`

## Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/verify-email` | Verify email using OTP |
| POST | `/auth/resend-otp` | Resend verification OTP |
| POST | `/auth/login` | Authenticate user |
| GET | `/auth/me` | Get current authenticated user |

## Document APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/documents/upload` | Upload and index a legal PDF |
| GET | `/documents` | List accessible documents |
| GET | `/documents/{id}` | Get document details |
| GET | `/documents/{id}/download` | Download a document |
| POST | `/documents/{id}/summary` | Generate document summary |

## Conversation APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/conversations/` | Get user conversations |
| GET | `/conversations/{id}` | Get conversation messages |
| DELETE | `/conversations/{id}` | Delete conversation |

## AI Question Answering

The question-answering route supports two answering modes.

| Request Field | Description |
|---|---|
| `use_multi_agent: false` | Existing advanced RAG |
| `use_multi_agent: true` | LangGraph research workflow |

The question-answering route is implemented in the existing RAG API router.

Refer to the actual router implementation for the exact route path and request schema.

### Example API Response

```json
{
    "conversation_id": "conversation-uuid",
    "question": "What was Section 66A of the IT Act?",
    "answer": "Section 66A was declared unconstitutional...",
    "sources": [
        {
            "filename": "Shreya_Singhal_Judgment.pdf",
            "page_number": 15,
            "content": "Relevant legal passage..."
        }
    ]
}
```

---

# 💻 Frontend Architecture

The frontend is developed using **Next.js and TypeScript**.

The frontend communicates with FastAPI through REST APIs.

### Planned Frontend Modules

| Module | Responsibility |
|---|---|
| Authentication | Registration, login, OTP verification |
| Dashboard | Overview of uploaded documents |
| Document Management | Upload and manage PDFs |
| AI Chat | Ask legal questions |
| Research Mode | Switch between Normal RAG and Research Agent |
| Source Viewer | View retrieved passages and page references |
| Summarization | Generate document summaries |
| Conversation History | Access previous conversations |
| User Profile | Manage account information |

### Frontend Workflow

```mermaid
flowchart TD
    A["Next.js Application"] --> B["Authentication Pages"]
    B --> C["JWT Token Management"]
    C --> D["Dashboard"]
    
    D --> E["Document Management"]
    D --> F["AI Chat Interface"]
    D --> G["Conversation History"]
    
    E --> H["FastAPI Document APIs"]
    F --> I["FastAPI Question API"]
    G --> J["FastAPI Conversation APIs"]
    
    I --> K["Normal RAG / Research Agent"]
    H --> L["PDF Ingestion"]
    J --> M["PostgreSQL"]
    
    K --> N["Answer + Sources"]
    N --> F
```

### AI Chat Modes

The chat interface will provide two modes:

**Normal RAG Mode**

Uses the existing advanced RAG pipeline:

- Query processing.
- Hybrid retrieval.
- RRF.
- Cross-encoder reranking.
- Groq answer generation.

**Research Agent Mode**

Uses the LangGraph workflow:

- Query understanding.
- Legal research.
- Context preparation.
- Legal analysis.
- Evidence verification.
- Fallback handling.

### Frontend Integration Example

A frontend request can pass the selected mode through the existing API field.

```typescript
type ResearchMode = "normal" | "research";

interface AskQuestionRequest {
  question: string;
  conversation_id?: string;
  document_id?: string;
  use_multi_agent: boolean;
}

const payload: AskQuestionRequest = {
  question: "What was Section 66A?",
  use_multi_agent: mode === "research"
};
```

The final request body should follow the exact schema implemented by the backend.

---

# 📁 Project Structure

The following represents the major project modules. The frontend directory is intended to be maintained separately from the FastAPI backend.

```text
NyayaAI/
│
├── main.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── alembic.ini
│
├── migrations/
│   ├── env.py
│   └── versions/
│
├── src/
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── documents.py
│   │       ├── conversations.py
│   │       └── rag_routes.py
│   │
│   ├── config/
│   │   ├── settings.py
│   │   └── db.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── legal_case.py
│   │   ├── document.py
│   │   ├── document_chunk.py
│   │   ├── conversation.py
│   │   ├── message.py
│   │   ├── citation.py
│   │   ├── document_job.py
│   │   └── email_otp.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   └── document.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── document_service.py
│   │   ├── rag_service.py
│   │   ├── advance_rag_services.py
│   │   ├── llm_service.py
│   │   ├── graph_rag_service.py
│   │   └── document_summary_service.py
│   │
│   ├── ingestion/
│   │   ├── embedding_model.py
│   │   └── ...
│   │
│   └── agents/
│       ├── legal_agents.py
│       └── legal_research_graph.py
│
├── storage/
│   └── documents/
│
├── data/
│   └── pdfs/
│
├── evaluation/
│   ├── dataset/
│   │   └── legal_questions.json
│   │
│   ├── results/
│   │   ├── ragas_dataset.json
│   │   └── ragas_scores.json
│   │
│   ├── generate_dataset.py
│   └── evaluate_rag.py
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── services/
    └── types/
```

*Note: This is a representative structure. Some files and modules may have different names or locations in the actual implementation.*

---

# ⚙️ Installation and Setup

## Prerequisites

Install the following:

- Python 3.13
- Node.js and npm
- PostgreSQL with pgvector
- Git
- Groq API key

## 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd NyayaAI
```

## 2. Create Python Virtual Environment

Windows PowerShell:

```powershell
python -m venv venv
```

Activate:

```powershell
.\venv\Scripts\Activate.ps1
```

## 3. Install Backend Dependencies

```powershell
pip install -r requirements.txt
```

## 4. Configure Environment Variables

Create a `.env` file in the project root.

```dotenv
DB_URL=postgresql+psycopg://username:password@localhost:5432/nyayaai

GROQ_API_KEY=your_groq_api_key

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Add any additional settings required by your current `src/config/settings.py`.

## 5. Run Database Migrations

```powershell
alembic upgrade head
```

## 6. Start the Backend

```powershell
python -m uvicorn main:app --reload --port 8080
```

Backend:

`http://localhost:8080`

Swagger API documentation:

`http://localhost:8080/docs`

## 7. Start the Frontend

Open another terminal.

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

`http://localhost:3000`

---

# 🐳 Docker Setup

NyayaAI includes a Docker-based development setup for running the backend and PostgreSQL database together.

### Docker Architecture

```mermaid
flowchart TD
    A["Developer"] --> B["Docker Compose"]
    
    B --> C["Backend Container"]
    B --> D["PostgreSQL + pgvector Container"]
    
    C --> E["FastAPI :8080"]
    C --> F["Hugging Face Model Cache"]
    C --> G["Document Storage Volume"]
    
    E --> D
    D --> H["PostgreSQL Persistent Volume"]
```

### Build and Run

```powershell
docker compose up --build
```

### Check Containers

```powershell
docker compose ps
```

### View Backend Logs

```powershell
docker compose logs -f backend
```

### Stop Containers

```powershell
docker compose down
```

The PostgreSQL and Hugging Face cache volumes are intended to persist between container restarts.

**Important:** Configure Docker environment variables and database connection settings for the container network. The backend must connect to the database service using its Compose service name rather than `localhost`.

---

# 🔑 Environment Variables

| Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL database connection string |
| `GROQ_API_KEY` | Groq API authentication key |
| `SECRET_KEY` | JWT signing secret |
| `ALGORITHM` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token expiration |
| `POSTGRES_DB` | Docker PostgreSQL database name |
| `POSTGRES_USER` | Docker PostgreSQL username |
| `POSTGRES_PASSWORD` | Docker PostgreSQL password |

Never commit `.env` files or API keys to GitHub.

---

# 📈 Evaluation Results

The first three legal questions were evaluated using RAGAS.

### Actual Preliminary Results

| Question | Faithfulness | Answer Relevancy |
|---|---:|---:|
| Section 66A and why it was struck down | 1.000 | 0.927 |
| Three concepts in Shreya Singhal | 0.000 | 0.835 |
| Public order proximity test | 1.000 | 0.935 |
| **Average** | **0.667** | **0.899** |

### Metric Interpretation

**Average Faithfulness: 0.667**

The generated responses were not consistently supported by the retrieved context. One evaluated response received a faithfulness score of zero.

This indicates that retrieval quality, context coverage, and answer grounding require further investigation.

**Average Answer Relevancy: 0.899**

The generated answers were generally relevant to the questions asked.

### Important Evaluation Note

These results are from only three evaluated questions and should be considered a preliminary baseline, not a statistically representative benchmark.

The next evaluation step is to run the full 50-question dataset and compare the two research modes separately.

---

# 📚 Dataset

The initial legal document collection contains nine PDFs.

### Supreme Court Judgments

1. Supreme Court Judgment — 1973.
2. Supreme Court Judgment — 1978.
3. Supreme Court Judgment — 1997.
4. Supreme Court Judgment — 2015.
5. Supreme Court Judgment — 2017.

### Indian Legislation

6. Constitution of India.
7. Bharatiya Sakshya Adhiniyam, 2023.
8. Bharatiya Nyaya Sanhita, 2023.
9. Bharatiya Nagarik Suraksha Sanhita, 2023.

The current evaluation dataset is designed around these documents.

---

# 🚧 Future Improvements

The following features can be considered for future development.

- [ ] Complete Next.js + TypeScript frontend.
- [ ] Improve citation handling and source highlighting.
- [ ] Evaluate the complete 50-question dataset.
- [ ] Compare Normal RAG and Research Agent performance.
- [ ] Add more Supreme Court and High Court judgments.
- [ ] Expand Hindi legal query support.
- [ ] Improve legal document retrieval.
- [ ] Add document comparison.
- [ ] Add structured legal information extraction.
- [ ] Add legal research report generation.
- [ ] Improve document processing scalability.
- [ ] Add production deployment and monitoring.

---

# 📖 Learning Resources and References

### Core Technologies

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)

### RAG and AI

- [LangChain Documentation](https://python.langchain.com/docs/)
- [LangGraph Documentation](https://docs.langchain.com/oss/python/langgraph/overview)
- [RAGAS Documentation](https://docs.ragas.io/)
- [Groq Documentation](https://console.groq.com/docs)
- [Hugging Face](https://huggingface.co/)
- [Sentence Transformers](https://sbert.net/)

### Indian Legal Resources

- [Supreme Court of India](https://www.sci.gov.in/)
- [India Code](https://www.indiacode.nic.in/)
- [eCourts](https://ecourts.gov.in/)

---

# 👨‍💻 Author

**Ayush Rajput**

B.Tech Computer Science Engineering

Interested in Backend Engineering, Generative AI, RAG Systems, Multi-Agent Architectures, and Full-Stack Development.

---

<p align="center">
  <strong>NyayaAI — Making Indian Legal Research More Accessible Through AI.</strong>
</p>