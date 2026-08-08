import { LEGAL_TEMPLATES } from "./templates";

const API_URL = "http://localhost:8000";

export const askLegalQuestion = async (
  query: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/ai/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || "AI request failed"
      );
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("AI Error:", error);
    return `Error connecting to AI: ${error.message}`;
  }
};

export const generateLegalDraft = async (
  clientName: string,
  noticeType: string,
  caseDetails: string
): Promise<string> => {
  const template =
    LEGAL_TEMPLATES[noticeType] ||
    "Standard legal document format";

  try {
    const response = await fetch(`${API_URL}/ai/draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_name: clientName,
        notice_type: noticeType,
        case_details: caseDetails,
        template,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || "Draft generation failed"
      );
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("AI Draft Error:", error);
    return `Error generating draft: ${error.message}`;
  }
};