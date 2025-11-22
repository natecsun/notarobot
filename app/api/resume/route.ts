import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Anthropic } from "@anthropic-ai/sdk";
import { sendTelegramAlert } from "@/lib/telegram";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const groqPaid = new Groq({
  apiKey: process.env.GROQ_API_KEY_PAID || process.env.GROQ_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // Convert PDF to base64 for Claude
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Pdf = buffer.toString('base64');

    try {
      // Use Claude to extract and rewrite resume text from PDF
      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64Pdf
                }
              },
              {
                type: "text",
                text: `You are an expert executive resume writer and career coach. Please analyze this resume PDF and:
1. Extract all the text content from the resume
2. Rewrite it to sound natural, confident, and human, removing obvious "AI-generated" patterns

Guidelines for rewriting:
- **Tone**: Professional, confident, yet authentic. Avoid being overly formal or flowery
- **Vocabulary**: Replace overused AI buzzwords (e.g., "spearhead", "leverage", "orchestrate", "synergy", "meticulous", "pivotal") with strong, simple action verbs (e.g., "led", "used", "managed", "created", "built")
- **Structure**: Convert passive voice to active voice. Ensure bullet points are punchy and results-oriented
- **Content**: Do NOT summarize. Rewrite the specific bullet points and descriptions to be more impactful. Preserve the original meaning and metrics

Return ONLY a JSON object with exactly two fields (no markdown formatting):
{
  "analysis": "A 1-2 sentence critique of the original resume's vibe",
  "rewritten_text": "The complete rewritten version of the resume text, formatted clearly with bullet points where appropriate"
}`
              }
            ]
          }
        ]
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

      if (!responseText) {
        throw new Error("No response from AI");
      }

      // Clean response text - remove markdown code blocks if present
      let cleanedResponse = responseText.trim();
      
      // Remove ```json and ``` markers if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Parse JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse Claude response:", cleanedResponse);
        console.error("Original response:", responseText);
        throw new Error("Invalid AI response format");
      }

      // Save result to database if user is logged in
      if (user && user.id) {
        try {
          await supabase
            .from('saved_results')
            .insert({
              user_id: user.id,
              service_type: 'resume',
              original_content: `Resume: ${file.name}`,
              analyzed_content: { analysis: parsedResponse.analysis },
              result_data: parsedResponse
            });
        } catch (saveError) {
          console.error('Error saving result:', saveError);
          // Don't fail the request if saving fails
        }
      }

      // Deduct credit OR increment visitor cookie
      if (user && user.id) {
        await supabase.rpc('deduct_credits', { user_id: user.id, amount: 1 });
      } else {
        // Increment visitor usage
        const currentUsage = parseInt(cookies().get("visitor_usage")?.value || "0");
        const response = NextResponse.json(parsedResponse);
        response.cookies.set("visitor_usage", (currentUsage + 1).toString(), { maxAge: 60 * 60 * 24 * 30 }); // 30 days
        return response;
      }

      return NextResponse.json(parsedResponse);

    } catch (apiError: any) {
      console.error("Claude API Error:", apiError);
      console.error("Error type:", apiError.constructor?.name);
      console.error("Error status:", apiError.status);
      console.error("Error message:", apiError.message);

      if (apiError.status === 429) {
        sendTelegramAlert("CRITICAL: Resume API Rate Limit Hit!");
        return NextResponse.json(
          { error: "System is under heavy load. Please try again shortly." },
          { status: 429 }
        );
      }

      throw apiError; // Re-throw for general error handler
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
