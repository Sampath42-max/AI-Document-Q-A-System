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
4. Citation handling:
   - If the provided context includes bracketed source markers (e.g., [1], [2]), use them to cite the passages that support your answer. Only use numbers that actually appear in the context — never invent or renumber them.
   - If the context does NOT include bracketed source markers (e.g., for document formats where citations aren't generated), do not fabricate citation numbers. Instead, answer directly from the context without bracketed references, optionally noting which section, heading, or page the information came from if that detail is available in the text.
5. If the answer cannot be found in the provided context, say so clearly rather than guessing.
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