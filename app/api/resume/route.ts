import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { sendTelegramAlert } from "@/lib/telegram";
import { createClient } from "@/utils/supabase/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Use paid client for credit users
    const client = groqPaid;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // 1. Extract Text from PDF using pdfjs-dist
    const arrayBuffer = await file.arrayBuffer();

    let resumeText = "";
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;

      const textParts: string[] = [];
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        textParts.push(pageText);
      }

      resumeText = textParts.join('\n').trim();
    } catch (e) {
      console.error("PDF Parse Error:", e);
      return NextResponse.json({ error: "Failed to parse PDF file." }, { status: 500 });
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: "Could not extract text. If this is a scanned PDF, please use a text-based PDF." }, { status: 400 });
    }

    // Limit text length to avoid token limits (approx 3000 tokens)
    const truncatedText = resumeText.slice(0, 12000);

    // 2. Send to Groq for Sanitization
    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an expert executive resume writer and career coach. Your goal is to rewrite resumes to sound natural, confident, and human, removing obvious "AI-generated" patterns.

            Guidelines:
            1.  **Tone**: Professional, confident, yet authentic. Avoid being overly formal or flowery.
            2.  **Vocabulary**: Replace overused AI buzzwords (e.g., "spearhead", "leverage", "orchestrate", "synergy", "meticulous", "pivotal") with strong, simple action verbs (e.g., "led", "used", "managed", "created", "built").
            3.  **Structure**: Convert passive voice to active voice. Ensure bullet points are punchy and results-oriented.
            4.  **Content**: Do NOT summarize. Rewrite the specific bullet points and descriptions provided in the input to be more impactful. Preserve the original meaning and metrics.
            
            Output Format:
            Return a JSON object with exactly two fields:
            - "analysis": A 1-2 sentence critique of the original text's "vibe" (e.g., "The original text relied heavily on passive voice and generic buzzwords like 'leverage'.").
            - "rewritten_text": The complete rewritten version of the resume text, formatted clearly with bullet points where appropriate.
            `
          },
          {
            role: "user",
            content: `Here is the resume text to humanize:\n\n${truncatedText}`
          }
        ],
        model: "llama3-8b-8192", // Fast and efficient
        temperature: 0.6, // Slightly higher for more natural variation
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
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name
    });
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
