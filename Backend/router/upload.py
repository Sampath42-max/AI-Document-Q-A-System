from fastapi import APIRouter, File, UploadFile, Header
from pathlib import Path
import os
import uuid
from services.file_serivce import validate
from services.parser_service import parse_document
from services.chunk_service import create_chunks
from services.embedding_service import generate_embeddings
from services.vector_service import store_documents, delete_document as vector_delete_document
from Database import save_document, get_documents, delete_document as db_delete_document

router = APIRouter()

@router.get("/documents")
async def list_documents(x_user_id: str = Header(default="default")):
    return get_documents(user_id=x_user_id)

@router.delete("/document/{doc_id}")
async def delete_document_endpoint(doc_id: str, x_user_id: str = Header(default="default")):
    db_delete_document(doc_id, user_id=x_user_id)
    try:
        vector_delete_document(doc_id)
    except Exception:
        pass
    return {"message": "Document deleted successfully"}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), x_user_id: str = Header(default="default")):
    metadata = await validate(file)
    
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    file_path = upload_dir / file.filename
    
    content = await file.read()
    with open(file_path, "wb") as buffer:
        buffer.write(content)
        
    doc_id = str(uuid.uuid4())
    try:
        text = parse_document(str(file_path))
        chunks = create_chunks(text)
        documents = generate_embeddings(chunks, doc_id)
        store_documents(documents, doc_id)
        
        doc_data = save_document(
            doc_id=doc_id,
            name=metadata.filename,
            size=metadata.size,
            doc_type=metadata.content_type,
            content=text,
            user_id=x_user_id
        )
    finally:
        if file_path.exists():
            file_path.unlink()

    return {
        "id": doc_id,
        "doc_id": doc_id,
        "name": metadata.filename,
        "size": metadata.size,
        "type": metadata.content_type,
        "uploadedAt": doc_data["uploadedAt"],
        "status": "indexed",
        "content": text,
        "paragraphs": doc_data["paragraphs"]
    }