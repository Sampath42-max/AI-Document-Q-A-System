import chromadb
import os
from dotenv import load_dotenv

load_dotenv()

client = chromadb.CloudClient(
  api_key = os.getenv('CHROMA_API_KEY'),
  tenant = os.getenv('CHROMA_TENANT'),
  database = os.getenv('CHROMA_DATABASE')
)

collection = client.get_or_create_collection(
    name = "document_system"
)

def store_documents(documents, doc_id: str):
    collection.add(
        ids = [
            doc["id"]
            for doc in documents
        ],
        documents = [
            doc["text"]
            for doc in documents
        ],
        embeddings= [
            doc["embedding"]
            for doc in documents
        ],
        metadatas = [
            {"document_id": doc_id}
            for _ in documents
        ]
        )
  
def search_documents(
        query_embedding, 
        doc_id: str,
        top_k = 10
):
    return collection.query(
        query_embeddings = [
            query_embedding
        ],
        where = {
            "document_id": doc_id
        },
        n_results = top_k
    )

def delete_document(doc_id: str):
    collection.delete(
        where = {
            "document_id": doc_id
        }
    )