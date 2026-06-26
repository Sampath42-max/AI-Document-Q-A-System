from fastapi import APIRouter, Header
from Models.Chat_model import ChatRequest
from services.embedding_service import generate_query_embedding
from services.vector_service import search_documents, collection
from services.llm_service import generate_answer
from services.query_service import preprocess_query
from Database import get_document, save_chat_message

router = APIRouter()

def find_best_paragraph_index(chunk: str, paragraphs: list[str]) -> int:
    for idx, para in enumerate(paragraphs):
        if chunk in para or para in chunk:
            return idx
    best_idx = 0
    max_overlap = 0
    chunk_set = set(chunk.split())
    for idx, para in enumerate(paragraphs):
        para_set = set(para.split())
        overlap = len(chunk_set.intersection(para_set))
        if overlap > max_overlap:
            max_overlap = overlap
            best_idx = idx
    return best_idx

@router.post("/chat")
async def chat(request: ChatRequest, x_user_id: str = Header(default="default")):
    doc = get_document(request.document_id, user_id=x_user_id)
    if not doc:
        return {"error": "Document not found"}
    paragraphs = doc["paragraphs"]

    clean_question = preprocess_query(request.question)
    question_embedding = generate_query_embedding(clean_question)

    results = search_documents(question_embedding, request.document_id)
    retrieved_chunks = results["documents"][0] if results and "documents" in results and results["documents"] else []

    keywords = ["author", "who wrote", "summary", "summarize", "about", "abstract", "title", "overview", "what is this"]
    is_general = any(k in request.question.lower() for k in keywords)
    
    first_chunks = []
    if is_general:
        try:
            first_chunk_ids = [f"{request.document_id}_0", f"{request.document_id}_1", f"{request.document_id}_2"]
            first_chunks_res = collection.get(ids=first_chunk_ids)
            first_chunks = first_chunks_res.get("documents", [])
        except Exception:
            pass

    combined_chunks = []
    seen = set()
    for chunk in (first_chunks + retrieved_chunks):
        if chunk not in seen:
            combined_chunks.append(chunk)
            seen.add(chunk)

    citations = []
    seen_indices = set()
    for chunk in combined_chunks:
        idx = find_best_paragraph_index(chunk, paragraphs)
        if idx not in seen_indices:
            seen_indices.add(idx)
            citations.append({
                "id": f"cit-{len(citations) + 1}",
                "index": idx,
                "text": paragraphs[idx],
                "snippet": paragraphs[idx][:120] + ("..." if len(paragraphs[idx]) > 120 else "")
            })

    context_parts = []
    for i, cit in enumerate(citations):
        context_parts.append(f"[{i+1}] {cit['text']}")
    context = "\n\n".join(context_parts) if context_parts else ""

    answer = generate_answer(request.question, context)

    # Save to chat history, scoped by user_id
    save_chat_message(request.document_id, "user", request.question, user_id=x_user_id)
    save_chat_message(request.document_id, "assistant", answer, citations, user_id=x_user_id)

    return {
        "question": request.question,
        "answer": answer,
        "citations": citations
    }