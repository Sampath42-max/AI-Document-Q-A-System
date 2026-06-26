from google import genai
from dotenv import load_dotenv
import os

load_dotenv(override=True)

client = genai.Client(
    api_key = os.getenv("GEMINI_API_KEY")
)


def generate_answer(
        question: str,
        context: str
):
    prompt = f"""
You are a highly helpful and precise AI document assistant.

Analyze the user's question and answer it based **strictly** on the provided document context.

Guidelines:
1. Provide a professional, direct, and well-structured answer.
2. If the user is asking about the document metadata (such as authors, title, affiliations, abstract) or asking for a general summary, synthesize a complete answer using the retrieved context (which contains the start of the document).
3. Do not assume or hallucinate details. Only reference facts present in the context.
4. If the answer is completely missing from the context and cannot be inferred, output: "I could not find the answer in the document."
5. Use bracketed citation numbers (like [1], [2], etc.) in your answer to cite the source passages from the context. Only use the numbers provided in the context.

Context:
{context}

Question:
{question}
"""
    response = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = prompt
    )

    return response.text