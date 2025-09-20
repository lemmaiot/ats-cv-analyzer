import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseAnalysisResponse = (responseText: string): AnalysisResult | null => {
  try {
    // Clean the response to ensure it's valid JSON.
    const cleanResponse = responseText.replace(/^```json\s*|```\s*$/g, '');
    return JSON.parse(cleanResponse) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON from response:", e, "Raw response:", responseText);
    return null;
  }
};

export const analyzeCvWithTrends = async (cvText: string, industry: string): Promise<{ analysis: AnalysisResult, sources: GroundingChunk[] } | null> => {
  const prompt = `
    You are MyCv.ng's AI assistant, an expert Nigerian HR professional and career coach. Your goal is to analyze a user's CV and provide a critical, helpful, and encouraging review in a friendly but professional Nigerian pidgin and English mix. You should be direct but supportive. Use Google Search to find the latest trends.

    The user's field is: ${industry}

    Here is the CV content:
    ---
    ${cvText}
    ---

    Your entire response MUST be a single JSON object string that starts with ' \`\`\`json ' and ends with ' \`\`\` '. Do not add any text before or after the JSON block.

    The JSON object MUST have these exact keys and structure:
    - "trends": An array of 3-5 short, string-based bullet points on the latest trends for the specified field based on your search.
    - "overallScore": An integer score from 0 to 100 representing the CV's overall strength.
    - "scoreBreakdown": An array of exactly 3 objects, each with "area", "score" (0-100), and "feedback". The areas MUST be "Clarity & Formatting", "Impact & Keywords", and "Experience Relevancy".
    - "summary": A short, one-sentence summary of the CV's potential, Nigerian style.
    - "keyImprovement": The single most important improvement the user should make, in one sentence.

    Example JSON response format:
    \`\`\`json
    {
      "trends": [
        "AI-powered tools are now common for applicant tracking.",
        "Remote work skills are highly sought after by employers.",
        "Data literacy is becoming a key skill in this industry."
      ],
      "overallScore": 85,
      "scoreBreakdown": [
        { "area": "Clarity & Formatting", "score": 90, "feedback": "Your CV is well-structured and easy to read, well done!" },
        { "area": "Impact & Keywords", "score": 80, "feedback": "You use strong action verbs, but could add more keywords relevant to ${industry}." },
        { "area": "Experience Relevancy", "score": 85, "feedback": "Your experience aligns well, but tailor it more for each job application." }
      ],
      "summary": "This your CV get as e be, e solid but small tuning go make am stand gidigba.",
      "keyImprovement": "Your top priority na to quantify your achievements with numbers to show your real impact."
    }
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const responseText = response.text;
    const analysis = parseAnalysisResponse(responseText);

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    if (!analysis) {
        console.error("Could not parse analysis from Gemini response.");
        throw new Error("Failed to get structured analysis from the AI.");
    }
    
    return { analysis, sources };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};