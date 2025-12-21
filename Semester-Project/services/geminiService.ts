import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateComplaintSummary = async (complaintsText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following list of hostel complaints and provide a concise summary of the main issues, severity, and a recommended action plan for the warden. \n\nComplaints Data:\n${complaintsText}`,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with AI service.";
  }
};

export const suggestMessMenu = async (preferences: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a healthy and budget-friendly weekly hostel mess menu (Breakfast, Lunch, Dinner) based on these preferences: ${preferences}. Format it as a clear markdown list.`
    });
    return response.text || "No menu generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating menu.";
  }
}