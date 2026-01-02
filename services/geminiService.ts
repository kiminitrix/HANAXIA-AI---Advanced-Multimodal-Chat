
import { GoogleGenAI } from "@google/genai";
import { Message, Role } from "../types";

/**
 * Service to handle communication with Google Gemini API.
 * Follows the @google/genai guidelines for initialization and content generation.
 */
export class GeminiService {
  async *streamChat(
    modelName: string,
    history: Message[],
    systemInstruction: string
  ) {
    // Always initialize a new GoogleGenAI instance with the latest API KEY from process.env.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Convert application history format to Gemini API contents format.
    const contents = history.map(msg => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    try {
      // Use generateContentStream for streaming responses.
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      for await (const chunk of responseStream) {
        // Access the generated text directly from the .text property of the response chunk.
        const text = chunk.text;
        if (text) {
          yield text;
        }
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
