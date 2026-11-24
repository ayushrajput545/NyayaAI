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
3. [Key Features](#-key-features)
4. [Technology Stack](#-technology-stack)
5. [Application Workflow and System Architecture](#-application-workflow-and-system-architecture)
6. [RAG Pipeline](#-rag-pipeline)
7. [Hybrid Search Architecture](#-hybrid-search-architecture)
8. [Advanced RAG Techniques](#-advanced-rag-techniques)
9. [Multi-Agent Legal Research System](#-multi-agent-legal-research-system)
10. [RAG Evaluation with RAGAS](#-rag-evaluation-with-ragas)
11. [Database Architecture](#-database-architecture)
12. [Backend API Endpoints](#-backend-api-endpoints)
13. [Frontend Architecture](#-frontend-architecture)
14. [Project Structure](#-project-structure)
15. [Installation and Setup](#-installation-and-setup)
16. [Docker Setup](#-docker-setup)
17. [Dataset](#-dataset)

---

# 🚀 Introduction

**NyayaAI** is an AI-powered Indian Legal Research and Document Intelligence Platform that simplifies legal research using Retrieval-Augmented Generation (RAG), hybrid information retrieval, and multi-agent AI workflows.

The platform allows users to upload legal documents, ask questions in natural language, retrieve relevant legal provisions and judgments, and receive AI-generated answers grounded in the uploaded documents — not hallucinated from general knowledge.

The platform supports Indian Supreme Court judgments, constitutional provisions, Bharatiya Nyaya Sanhita (BNS) 2023, Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023, Bharatiya Sakshya Adhiniyam (BSA) 2023, user-uploaded legal PDFs, English and Hindi queries, and conversational research.

> **Disclaimer:** NyayaAI is an experimental legal research assistant, not a substitute for professional legal advice. Outputs should be verified against original legislation and qualified legal professionals.

---

# 🎥 Application Walkthrough

**Video:** (https://youtu.be/IICkGENzIdg)

The walkthrough demonstrates: user registration and email verification, login, dashboard navigation, uploading legal PDFs, document processing and indexing, asking questions in Quick Research and Deep Research modes, viewing retrieved sources and page references, generating document summaries, and managing conversation history.

---

# ✨ Key Features

| Feature | Description |
|---|---|
| PDF Upload | Upload and manage legal PDF documents |
| Document Ingestion | Extract, clean, split, and index PDF content |
| Multilingual Embeddings | Search legal content in English and Hindi |
| Hybrid Search | Combine semantic and keyword retrieval |
| Reciprocal Rank Fusion | Combine multiple retrieval rankings |
| Cross-Encoder Reranking | Improve relevance of retrieved passages |
| Query Expansion | Generate alternative search queries |
| Conversational RAG | Maintain context across multiple questions |
| Source References | Provide document names and page references |
| Multi-Agent Research | Coordinate specialized legal research agents |
| Document Summarization | Generate structured summaries of uploaded documents |
| RAGAS Evaluation | Evaluate faithfulness and answer relevancy |
| Authentication | JWT-based authentication and protected APIs |
| Conversation Management | Create, retrieve, and delete conversations |

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
| LangChain | LLM and RAG integrations |
| LangGraph | Multi-agent workflow orchestration |
| LangChain-Groq | Groq LLM integration |
| Sentence Transformers | Multilingual embeddings |
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
| Tailwind CSS | Styling and responsive UI |

## AI and Machine Learning

| Technology | Purpose |
|---|---|
| Groq (GPT-OSS-120B) | LLM inference and agent reasoning |
| Sentence Transformers | Multilingual text embeddings |
| BM25 | Lexical retrieval |
| Reciprocal Rank Fusion | Retrieval result fusion |
| Cross-Encoder | Context reranking |
| LangGraph | Agent workflow orchestration |
| RAGAS | RAG quality evaluation |

### LLM Configuration

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

384-dimensional embeddings with multilingual semantic retrieval support.

---

# 🔄 Application Workflow and System Architecture

NyayaAI follows a layered architecture: Presentation (Next.js) → API (FastAPI + JWT) → Service (RAG, agents, conversations) → AI (embeddings, hybrid search, LLM) → Data (PostgreSQL + pgvector).

```mermaid
flowchart TD
    A["User Opens Application"] --> B["Register / Login - JWT Auth"]
    B --> D["Dashboard"]

    D --> E["Upload Legal PDF"]
    E --> F["Validate → Extract Text → Chunk → Embed → Store in pgvector"]

    D --> M["Ask Legal Question"]
    M --> N{"Select Research Mode"}

    N -->|"Quick Research"| O["Advanced RAG Pipeline"]
    N -->|"Deep Research"| P["LangGraph Multi-Agent Workflow"]

    O --> Q["Hybrid Retrieval → Reranking → Context"]
    P --> Q

    Q --> R["Groq LLM Answer Generation"]
    R --> S["Return Answer + Sources + Page Numbers"]
    S --> T["Save to Conversation History"]
```

---

# 📚 RAG Pipeline

RAG combines information retrieval with language model generation. Instead of relying on the LLM's internal knowledge, NyayaAI retrieves relevant passages from legal documents and uses them as grounded context.

```mermaid
flowchart LR
    subgraph Indexing
        A["Upload PDF"] --> B["Extract Text\n(PyPDFLoader)"]
        B --> C["Chunk Text\n(500 chars / 50 overlap)"]
        C --> D["Generate Embeddings\n(MiniLM-L12-v2)"]
        D --> E["Store in\nPostgreSQL + pgvector"]
    end

    subgraph Query
        F["User Question"] --> G["Embed Question"]
        G --> H["Hybrid Retrieval"]
        H --> I["Rerank + Filter"]
        I --> J["Groq LLM"]
        J --> K["Answer + Sources"]
    end
```

| Parameter | Value |
|---|---:|
| Chunk Size | 500 characters |
| Chunk Overlap | 50 characters |
| Embedding Dimensions | 384 |
| Final Context Chunks | Top 5 |

The LLM prompt instructs the model to use only the provided context, cite source documents and page numbers, respond in the query language, and avoid inventing legal facts.

---

# 🔍 Hybrid Search Architecture

Combining keyword and semantic search improves retrieval of legal terminology, section numbers, and conceptual questions.

```mermaid
flowchart LR
    Q["User Query"] --> BM["BM25\nKeyword Search"]
    Q --> VS["pgvector\nSemantic Search"]
    BM --> RRF["Reciprocal Rank Fusion\n(k=60)"]
    VS --> RRF
    RRF --> CE["Cross-Encoder\nReranking"]
    CE --> RF["Relevance Filter\n(score ≥ 0.35)"]
    RF --> CTX["Top 5 Context Chunks"]
```

| Stage | Technique |
|---|---|
| Keyword Retrieval | BM25 |
| Semantic Retrieval | pgvector cosine similarity |
| Result Combination | Reciprocal Rank Fusion |
| Reranking | Cross-Encoder |
| Final Context | Top 5 relevant chunks |

RRF formula: `RRF(d) = Σ 1 / (k + rank_r(d))` where k = 60.

---

# 🧠 Advanced RAG Techniques

```mermaid
flowchart LR
    A["User Question\n+ History"] --> B["Query Rewriting\n(standalone question)"]
    B --> C["Query Expansion\n(2 alternatives via Groq)"]
    C --> D["Hybrid Search\n× 3 queries"]
    D --> E["Merge + Deduplicate"]
    E --> F["Cross-Encoder Rerank\n(threshold ≥ 0.35)"]
    F --> G["Top 5 Chunks → LLM"]
```

- **Query Rewriting:** Converts follow-up questions into standalone queries using conversation history.
- **Query Expansion:** Generates two alternative queries to improve retrieval coverage.
- **Multi-Query Retrieval:** All queries run through the full hybrid pipeline; duplicates are removed before reranking.

---

# 🤖 Multi-Agent Legal Research System

NyayaAI includes a LangGraph-based multi-agent workflow (Deep Research mode) with six specialized agents.

```mermaid
flowchart TD
    A["User Question"] --> B["Query Understanding Agent\n(rewrite + interpret)"]
    B --> C["Legal Research Agent\n(hybrid retrieval)"]
    C --> D{"Documents Found?"}
    D -->|Yes| E["Legal Context Agent\n(organize evidence)"]
    D -->|No| I["Fallback Agent"]
    E --> F["Legal Analysis Agent\n(generate answer via Groq)"]
    F --> G["Evidence Verification Agent\n(PASS / FAIL)"]
    G -->|PASS| H["Return Answer"]
    G -->|FAIL| I
    I --> J["Return Cautious Fallback"]
```

| Agent | Responsibility |
|---|---|
| Query Understanding | Interpret and rewrite the user query |
| Legal Research | Retrieve relevant documents via advanced search |
| Legal Context | Organize and format retrieved evidence |
| Legal Analysis | Generate answer using Groq |
| Evidence Verification | Verify answer is grounded in context |
| Fallback | Handle insufficient evidence cases safely |

Both Quick Research and Deep Research modes reuse the same underlying retrieval infrastructure.

---

# 📊 RAG Evaluation with RAGAS

NyayaAI uses RAGAS to evaluate retrieval and generation quality.

**Metrics:**

- **Faithfulness:** Whether the generated answer is supported by retrieved context. Range: [0, 1].
- **Answer Relevancy:** Whether the answer addresses the user's question. Range: [0, 1].

**Evaluation Dataset Format:**

```json
{
    "user_input": "What was Section 66A of the IT Act?",
    "response": "Section 66A was struck down by the Supreme Court...",
    "retrieved_contexts": ["Relevant passage from the Shreya Singhal judgment..."],
    "reference": "Verified reference answer..."
}
```

The evaluation dataset covers 50 legal questions across Supreme Court judgments, the Indian Constitution, BNS, BNSS, and BSA. RAGAS 0.4.3 is used with Groq as the evaluation LLM and multilingual HuggingFace embeddings for relevancy scoring.

**Results (50 questions evaluated):**

| Metric | Score |
|---|---:|
| Total Questions Evaluated | 50 |
| Average Faithfulness | 0.860 |
| Average Answer Relevancy | 0.899 |

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

# 🔌 Backend API Endpoints

Base URL: `http://localhost:8080/api/v1`

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/verify-email` | Verify email using OTP |
| POST | `/auth/resend-otp` | Resend verification OTP |
| POST | `/auth/login` | Authenticate user |
| GET | `/auth/me` | Get current authenticated user |

Authentication uses Argon2 password hashing, email OTP verification, JWT access tokens (30-minute expiry), and user ownership checks on all protected routes.

## Documents

| Method | Endpoint | Description |
|---|---|---|
| POST | `/documents/upload` | Upload and index a legal PDF |
| GET | `/documents` | List accessible documents |
| GET | `/documents/{id}` | Get document details |
| GET | `/documents/{id}/download` | Download a document |
| POST | `/documents/{id}/summary` | Generate document summary |

## Conversations

| Method | Endpoint | Description |
|---|---|---|
| GET | `/conversations/` | Get user conversations |
| GET | `/conversations/{id}` | Get conversation messages |
| DELETE | `/conversations/{id}` | Delete conversation |

## Question Answering

Pass `use_multi_agent: false` for Quick Research (Advanced RAG) or `use_multi_agent: true` for Deep Research (LangGraph).

**Example response:**
```json
{
    "conversation_id": "uuid",
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

Built with Next.js and TypeScript, communicating with FastAPI via REST APIs.

| Module | Responsibility |
|---|---|
| Authentication | Registration, login, OTP verification |
| Dashboard | Overview of uploaded documents |
| Document Management | Upload and manage PDFs |
| AI Chat | Ask legal questions in Quick or Deep Research mode |
| Source Viewer | View retrieved passages and page references |
| Conversation History | Access previous conversations |

**Research mode request type:**
```typescript
interface AskQuestionRequest {
  question: string;
  conversation_id?: string;
  document_id?: string;
  use_multi_agent: boolean; // false = Quick Research, true = Deep Research
}
```

---

# 📁 Project Structure

```text
NyayaAI/
│
├── main.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env
├── alembic.ini
│
├── migrations/
│   └── versions/
│
├── src/
│   ├── api/v1/
│   │   ├── auth.py
│   │   ├── documents.py
│   │   ├── conversations.py
│   │   └── rag_routes.py
│   ├── config/
│   │   ├── settings.py
│   │   └── db.py
│   ├── models/
│   ├── schemas/
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── document_service.py
│   │   ├── rag_service.py
│   │   ├── advance_rag_services.py
│   │   ├── llm_service.py
│   │   ├── graph_rag_service.py
│   │   └── document_summary_service.py
│   ├── ingestion/
│   └── agents/
│       ├── legal_agents.py
│       └── legal_research_graph.py
│
├── storage/documents/
├── data/pdfs/
│
├── evaluation/
│   ├── dataset/legal_questions.json
│   ├── results/
│   │   ├── ragas_dataset.json
│   │   └── ragas_scores.json
│   ├── generate_dataset.py
│   └── evaluate_rag.py
│
└── frontend/
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── services/
    └── types/
```

---

# ⚙️ Installation and Setup

**Prerequisites:** Python 3.13, Node.js and npm, PostgreSQL with pgvector, Groq API key.

```bash
# 1. Clone
git clone YOUR_REPOSITORY_URL
cd NyayaAI

# 2. Virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows
source venv/bin/activate       # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure .env
DB_URL=postgresql+psycopg://username:password@localhost:5432/nyayaai
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 5. Run migrations
alembic upgrade head

# 6. Start backend
python -m uvicorn main:app --reload --port 8080

# 7. Start frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Backend: `http://localhost:8080` | Swagger docs: `http://localhost:8080/docs` | Frontend: `http://localhost:3000`

---

# 🐳 Docker Setup

```bash
# Build and run
docker compose up --build

# Check containers
docker compose ps

# View backend logs
docker compose logs -f backend

# Stop
docker compose down
```

> **Note:** Configure the backend database connection to use the Compose service name instead of `localhost` when running in Docker.

---

# 📚 Dataset

**Supreme Court Judgments:** 1973, 1978, 1997, 2015, 2017.

**Indian Legislation:** Constitution of India, Bharatiya Sakshya Adhiniyam 2023, Bharatiya Nyaya Sanhita 2023, Bharatiya Nagarik Suraksha Sanhita 2023.

**Legal Resources:**
- [Supreme Court of India](https://www.sci.gov.in/)
- [India Code](https://www.indiacode.nic.in/)
- [eCourts](https://ecourts.gov.in/)

**Core References:**
- [FastAPI](https://fastapi.tiangolo.com/) · [LangChain](https://python.langchain.com/docs/) · [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) · [RAGAS](https://docs.ragas.io/) · [pgvector](https://github.com/pgvector/pgvector) · [Groq](https://console.groq.com/docs) · [Sentence Transformers](https://sbert.net/)

---

# 👨‍💻 Author

**Ayush Rajput** — B.Tech Computer Science Engineering

Interested in Backend Engineering, Generative AI, RAG Systems, Multi-Agent Architectures, and Full-Stack Development.

---

<p align="center">
  <strong>NyayaAI — Making Indian Legal Research More Accessible Through AI.</strong>
</p>
