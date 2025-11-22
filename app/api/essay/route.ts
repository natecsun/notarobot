import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { sendTelegramAlert } from "@/lib/telegram";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const groqPaid = new Groq({
  apiKey: process.env.GROQ_API_KEY_PAID || process.env.GROQ_API_KEY,
});

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

    const { text } = await req.json();

    if (!text || text.length < 50) {
        return NextResponse.json({ error: "Text too short. Please enter at least 50 characters." }, { status: 400 });
    }

    // Use paid client
    const client = groqPaid;

    // Send to Groq
    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an expert academic integrity officer and linguistics analyst. Your job is to analyze text for signs of AI generation (LLM usage).
            
            Analyze the user's text for:
            1. Perplexity (Low perplexity = likely AI).
            2. Burstiness (Low burstiness = likely AI).
            3. Repetitive sentence structures.
            4. Overuse of transition words ("Firstly", "In conclusion", "Furthermore").
            5. Lack of personal nuance or specific, non-generic examples.

            Return a JSON object with:
            - "ai_probability": number between 0-100 (100 = definitely AI).
            - "verdict": "Likely Human", "Mixed/Edited", or "Likely AI".
            - "analysis": An array of strings explaining specific findings (e.g. "Consistent sentence length suggests AI", "Generic conclusion").
            - "highlight_sections": An array of strings containing specific suspicious sentences from the text (max 3).
            `
          },
          {
            role: "user",
            content: `Analyze this text:\n\n${text.slice(0, 15000)}`
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.1,
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
        const currentUsage = parseInt(cookies().get("visitor_usage")?.value || "0");
        const response = NextResponse.json(JSON.parse(responseContent));
        response.cookies.set("visitor_usage", (currentUsage + 1).toString(), { maxAge: 60 * 60 * 24 * 30 });
        return response;
      }

      return NextResponse.json(JSON.parse(responseContent));

    } catch (groqError: any) {
      if (groqError.status === 429) {
        sendTelegramAlert("CRITICAL: Essay API Rate Limit Hit!");
        return NextResponse.json(
          { error: "System is under heavy load. Please try again shortly." },
          { status: 429 }
        );
      }
      throw groqError;
    }

  } catch (error) {
    console.error("Error analyzing essay:", error);
    return NextResponse.json(
      { error: "Failed to analyze essay." },
      { status: 500 }
    );
  }
}
