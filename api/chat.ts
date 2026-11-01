import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI service is not configured. Add GEMINI_API_KEY in Vercel Project Settings and redeploy." });
  }

  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) return res.status(400).json({ error: "Please enter a message." });
    if (message.length > 12000) return res.status(413).json({ error: "Message is too long. Please shorten it." });

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: { systemInstruction: "You are Wistab AI, a helpful, accurate assistant. Be clear, practical, and friendly. Do not claim to access live client databases or external systems unless tools actually provide that access." }
    });
    const answer = result.text?.trim();
    if (!answer) return res.status(502).json({ error: "The AI model returned an empty response. Please try again." });
    return res.status(200).json({ reply: answer });
  } catch (error: any) {
    console.error("Wistab Gemini API error:", error?.message || error);
    return res.status(502).json({ error: "Wistab AI could not get a response from Gemini. Check the API key, Gemini API access, and Vercel function logs." });
  }
}
