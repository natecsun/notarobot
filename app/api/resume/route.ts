import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { sendTelegramAlert } from "@/lib/telegram";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require("pdf-parse");

const groqFree = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const groqPaid = new Groq({
  apiKey: process.env.GROQ_API_KEY_PAID || process.env.GROQ_API_KEY, // Fallback to free if not set
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const tier = formData.get("tier") as string; // 'free' or 'paid'

    const client = tier === "paid" ? groqPaid : groqFree;

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
      const chatCompletion = await client.chat.completions.create({
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
        // Only alert if it's the free tier hitting limits
        if (tier !== 'paid') {
             sendTelegramAlert("RATE LIMIT HIT: Resume Sanitizer API (429) - Free Tier");
             return NextResponse.json(
               { error: "Free tier traffic is high! Please try again in a minute or upgrade to Pro." },
               { status: 429 }
             );
        } else {
             // Paid tier hit a limit (should be rare)
             sendTelegramAlert("CRITICAL: Paid Tier Rate Limit Hit!");
             return NextResponse.json(
                { error: "System is under heavy load. Please try again shortly." },
                { status: 429 }
             );
        }
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
