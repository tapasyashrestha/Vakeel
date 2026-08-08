import os

from fastapi import APIRouter, HTTPException
from google import genai
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI"])


class LegalQuestionRequest(BaseModel):
    query: str


class LegalDraftRequest(BaseModel):
    client_name: str
    notice_type: str
    case_details: str
    template: str
def generate_with_fallback(client, prompt: str):
    models = [
        "gemini-3.6-flash",
        "gemini-3.5-flash-lite",
    ]

    last_error: Exception | None = None

    for model_name in models:
        try:
            return client.models.generate_content(
                model=model_name,
                contents=prompt
            )
        except Exception as exc:
            last_error = exc
            print(f"{model_name} failed:", exc)

    if last_error is not None:
        raise last_error

    raise RuntimeError("No Gemini models were available")


def get_gemini_client():
    api_key = os.environ.get("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is not configured"
        )

    return genai.Client(api_key=api_key)


@router.post("/ask")
async def ask_legal_question(request: LegalQuestionRequest):
    client = get_gemini_client()

    prompt = f"""
You are Vakeel, an expert Indian legal AI assistant.

Answer the following legal query accurately and professionally.

Query:
{request.query}
"""

    try:
        response = generate_with_fallback(client, prompt)

        return {"text": response.text}

    except Exception as exc:
        print("Gemini ask error:", exc)
        raise HTTPException(
            status_code=500,
            detail="Unable to generate AI response"
        )


@router.post("/draft")
async def generate_legal_draft(request: LegalDraftRequest):
    client = get_gemini_client()

    prompt = f"""
You are an expert Indian lawyer.

Draft a professional legal document based on the following details.

IMPORTANT CRITERIA:
- Generate the draft in PLAIN TEXT ONLY.
- DO NOT use Markdown formatting.
- DO NOT use asterisks for bolding.
- Strictly follow this template:

{request.template}

Client Name: {request.client_name}
Document Type: {request.notice_type}
Case Details: {request.case_details}

Replace relevant placeholders with the supplied information.
Draft the document clearly and professionally.
"""

    try:
        response = generate_with_fallback(client, prompt)

        return {"text": response.text}

    except Exception as exc:
        print("Gemini draft error:", exc)
        raise HTTPException(
            status_code=500,
            detail="Unable to generate legal draft"
        )