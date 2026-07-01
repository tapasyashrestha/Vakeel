import { GoogleGenerativeAI } from "@google/generative-ai";
import { LEGAL_TEMPLATES } from "./templates";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "dummy-key");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const askLegalQuestion = async (query: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
  }

  const prompt = `
    You are Vakeel, an expert Indian legal AI assistant.
    Answer the following legal query accurately and professionally.
    Query: ${query}
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `Error connecting to AI: ${error.message}`;
  }
};

export const generateLegalDraft = async (
  clientName: string,
  noticeType: string,
  caseDetails: string
): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
  }

  const templateStr = LEGAL_TEMPLATES[noticeType] || "Standard legal document format";

  const prompt = `
    You are an expert Indian lawyer. Draft a professional legal document based on the following details.
    
    IMPORTANT CRITERIA:
    - Generate the draft in PLAIN TEXT ONLY.
    - DO NOT use any Markdown formatting.
    - DO NOT use asterisks (**) for bolding.
    - YOU MUST STRICTLY FOLLOW THIS TEMPLATE STRUCTURE EXACTLY:
    
    ${templateStr}
    
    Replace all placeholders like [Applicant Name], [Case Facts], [Address], [City], [Year] with the actual details provided below. Keep the formal language intact.
    
    Client Name: ${clientName}
    Document Type: ${noticeType}
    Case Details: ${caseDetails}
    
    Draft the document clearly and professionally.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `Error generating draft: ${error.message}`;
  }
};
