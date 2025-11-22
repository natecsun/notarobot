import { NextResponse } from "next/server";
import Groq from "groq-sdk";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require("pdf-parse");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Extract Text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    const resumeText = data.text;

    // Limit text length to avoid token limits (approx 3000 tokens)
    const truncatedText = resumeText.slice(0, 12000);

    // 2. Send to Groq for Sanitization
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional career coach and resume editor. Your goal is to "humanize" resumes that sound like they were written by AI.
            
            Specific Instructions:
            1. Remove robotic buzzwords like "leverage", "utilize", "spearhead", "synergy", "meticulous".
            2. Rewrite passive voice to active voice.
            3. Keep the tone professional but conversational and authentic.
            4. Do not summarize. Rewrite the key bullet points to be impactful.
            5. Return the response in JSON format with two fields: 
               - "analysis": A short 1-sentence critique of the original vibe.
               - "rewritten_text": The improved version of the resume text.
            `
          },
          {
            role: "user",
            content: `Here is the resume text:\n\n${truncatedText}`
          }
        ],
        model: "llama3-8b-8192", // Fast and efficient
        temperature: 0.5,
        response_format: { type: "json_object" }
      });

      const responseContent = chatCompletion.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error("No response from AI");
      }

      return NextResponse.json(JSON.parse(responseContent));

    } catch (groqError: any) {
      if (groqError.status === 429) {
        // Fire-and-forget alert
        sendTelegramAlert("RATE LIMIT HIT: Resume Sanitizer API (429)");
        
        return NextResponse.json(
          { error: "Traffic is high! We hit the free tier limit. Please try again in a minute." },
          { status: 429 }
        );
      }
      throw groqError; // Re-throw for general error handler
    }

  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
