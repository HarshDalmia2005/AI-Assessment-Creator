import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// We default to a placeholder if GEMINI_API_KEY is missing, but it will throw on actual generation
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "MISSING_KEY",
});

export const generateAssessmentWithGemini = async (payload: any) => {
  const prompt = `
You are an expert teacher creating an assessment.
Generate a question paper based on the following requirements:
Additional Instructions: ${payload.additionalInstructions}
Question Types Requested:
${payload.questionTypes.map((qt: any) => `- ${qt.count} questions of type: ${qt.type} (Marks per question: ${qt.marks})`).join("\n")}

Please return the output EXACTLY as a JSON string with the following structure, and nothing else (do not wrap in markdown code blocks like \`\`\`json):
{
  "title": "A concise, catchy title for this assignment (e.g., 'Science Quiz: Electricity')",
  "questions": [
    {
      "id": "q1",
      "text": "Question text here",
      "marks": 2,
      "difficulty": "Easy" // can be Easy, Moderate, or Challenging
    }
  ],
  "answers": [
    "Answer for q1",
    "Answer for q2"
  ]
}
`;

  try {
    let contentsArray: any[] = [{ text: prompt }];

    if (payload.fileData && payload.fileMimeType) {
      contentsArray.unshift({
        inlineData: {
          data: payload.fileData,
          mimeType: payload.fileMimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentsArray,
      config: {
        temperature: 0.7,
      },
    });

    const textOutput = response.text || "{}";
    // Attempt to clean markdown if the model hallucinates it
    const cleanJson = textOutput
      .replace(/```json\n/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate assessment");
  }
};
