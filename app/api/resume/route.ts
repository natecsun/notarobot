import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { sendTelegramAlert } from "@/lib/telegram";
import { createClient } from "@/utils/supabase/server";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require("pdf-parse");

const groqPaid = new Groq({
  apiKey: process.env.GROQ_API_KEY_PAID || process.env.GROQ_API_KEY,
});

import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const cookieStore = cookies();

    // Visitor Logic (No User)
    if (!user) {
      const usageCount = parseInt(cookieStore.get("visitor_usage")?.value || "0");
      if (usageCount >= 2) {
        return NextResponse.json({ error: "Visitor limit reached. Please sign up for 50 free credits." }, { status: 403 });
      }
    } else {
      // User Logic (Check Credits)
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.credits || 0) < 1) {
        return NextResponse.json({ error: "Insufficient credits. Please buy more." }, { status: 403 });
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Use paid client for credit users
    const client = groqPaid;

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

      // Deduct credit OR increment visitor cookie
      if (user && user.id) {
        await supabase.rpc('deduct_credits', { user_id: user.id, amount: 1 });
      } else {
        // Increment visitor usage
        const currentUsage = parseInt(cookies().get("visitor_usage")?.value || "0");
        const response = NextResponse.json(JSON.parse(responseContent));
        response.cookies.set("visitor_usage", (currentUsage + 1).toString(), { maxAge: 60 * 60 * 24 * 30 }); // 30 days
        return response;
      }

      return NextResponse.json(JSON.parse(responseContent));

    } catch (groqError: any) {
      if (groqError.status === 429) {
        sendTelegramAlert("CRITICAL: Resume API Rate Limit Hit!");
        return NextResponse.json(
          { error: "System is under heavy load. Please try again shortly." },
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
