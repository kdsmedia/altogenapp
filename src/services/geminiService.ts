import { GoogleGenerativeAI } from "@google/generative-ai";

// Di React Native, kita biasanya menggunakan API_KEY dari constants atau env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiService = {
  async generateChatResponse(prompt: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },

  async generateVideoPrompt(description: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(`Generate a detailed visual prompt for a 5-second video based on this: ${description}`);
    const response = await result.response;
    return response.text();
  },

  async getVideoInstruction(prompt: string, useSubtitle: boolean) {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    
    const result = await model.generateContent(`Tugas: Buat instruksi video 5 detik. Prompt: "${prompt}". Subtitle: ${useSubtitle}. Berikan output JSON dengan field: visual (zoom_in, zoom_out, pan_right), narasi (maks 8 kata), tone (gentle, bold).`);
    const response = await result.response;
    const text = response.text();
    
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      return null;
    }
  }
};
