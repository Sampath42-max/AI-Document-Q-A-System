# AI Document Q&A System

## Overview

AI Document Q&A is a FastAPI-based backend application that allows users to upload documents and ask questions based on their content. The system uses Retrieval-Augmented Generation (RAG) with Gemini Embeddings and ChromaDB for semantic search.

---

## Features

- User Authentication (Upcoming)
- Upload Documents
- File Validation
- Document Parsing
- Intelligent Chunking
- Generate Embeddings
- Store Embeddings in ChromaDB
- Semantic Search
- AI-powered Question Answering
- Chat History (Upcoming)

---

## Supported File Formats

- PDF (.pdf)
- SVG (.svg)
- WEBP (.webp)
- DOCX (.docx)
- HTML (.html)
- XLSX (.xlsx)
- CSV (.csv)

---

## Project Structure

```
app/

│── routers/
│   ├── upload.py
│   ├── chat.py
│   └── history.py

│── services/
│   ├── file_service.py
│   ├── parser_service.py
│   ├── chunk_service.py
│   ├── embedding_service.py
│   ├── vector_service.py
│   ├── llm_service.py
│   └── query_service.py

│── models/

│── database.py

│── main.py
```

---

## Workflow

```
Upload Document

↓

Validate File

↓

Parse Document

↓

Create Chunks

↓

Generate Embeddings

↓

Store in ChromaDB

=========================

User Question

↓

Preprocess Query

↓

Generate Query Embedding

↓

Retrieve Relevant Chunks

↓

Generate Answer using Gemini

↓

Return Response
```

---

## Technologies Used

- FastAPI
- Python
- Google Gemini API
- Gemini Embedding Model
- ChromaDB
- LangChain Text Splitter
- Pydantic
- python-dotenv

---

## Environment Variables

Create a `.env` file.

```env
GEMINI_API_KEY=YOUR_API_KEY

CHROMA_API_KEY=YOUR_CHROMA_API_KEY

CHROMA_TENANT=YOUR_TENANT

CHROMA_DATABASE=YOUR_DATABASE
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run the Project

```bash
uvicorn app:app --reload
```

---

## API Endpoints

### Upload Document

```
POST /upload
```

Uploads a document, parses it, creates chunks, generates embeddings, and stores them in ChromaDB.

---

### Chat

```
POST /chat
```

Accepts a user question, retrieves the most relevant chunks, and generates an answer using Gemini.

---

## Current Pipeline

```
Document Upload
        │
        ▼
Document Parsing
        │
        ▼
Chunk Creation
        │
        ▼
Embedding Generation
        │
        ▼
ChromaDB Storage
        │
        ▼
User Question
        │
        ▼
Query Embedding
        │
        ▼
Similarity Search
        │
        ▼
Gemini Response
```

---

## Upcoming Improvements

- JWT Authentication
- Role-Based Access Control (RBAC)
- Multi-user Support
- Chat History
- Conversation Memory
- Better Semantic Chunking
- Reranking
- Background Tasks
- Docker Deployment
- Logging and Monitoring
- Rate Limiting
- Production Deployment

---

## Author

**Sampath Kumar**
