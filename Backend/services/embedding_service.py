from google import genai
from dotenv import load_dotenv 
import os
import uuid

load_dotenv(override=True)

client = genai.Client(
    api_key = os.getenv("GEMINI_API_KEY")
)

def generate_embeddings(chunks: list[str], doc_id: str):

    documents = []

    for index, chunk in enumerate(chunks):

        response = client.models.embed_content(

            model="gemini-embedding-001",

            contents=chunk
        )

        documents.append({

            "id": f"{doc_id}_{index}",

            "text": chunk,

            "embedding": response.embeddings[0].values
        })

    return documents

def generate_query_embedding(text: str) -> list[float]:
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text
    )
    return response.embeddings[0].values