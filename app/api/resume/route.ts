import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Anthropic } from "@anthropic-ai/sdk";
import { sendTelegramAlert } from "@/lib/telegram";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { checkUserCreditsOrVisitorLimit, deductCreditsOrTrackVisitor } from "@/lib/credits";
import { RESUME_FILE_LIMIT } from "@/lib/config";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const cookieStore = cookies();

    // Check Credits or Visitor Limit
    const creditCheck = await checkUserCreditsOrVisitorLimit(supabase, user, cookieStore);
    if (!creditCheck.allowed) {
      return NextResponse.json({ error: creditCheck.error }, { status: creditCheck.status || 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size
    if (file.size > RESUME_FILE_LIMIT) {
      return NextResponse.json({ error: `File size exceeds ${RESUME_FILE_LIMIT / 1024 / 1024}MB limit.` }, { status: 400 });
    }

    // Convert PDF to base64 for Claude
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Pdf = buffer.toString('base64');

    try {
      // Use Claude to extract and rewrite resume text from PDF
      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8192,
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
1. Extract the text content from the resume (if it's a sample/template document, just analyze the first/main resume)
2. Analyze it for "AI-generated" patterns (buzzwords, sentence structure, perplexity)
3. Rewrite it to sound natural, confident, and human

IMPORTANT: If the document contains multiple sample resumes or is very long, only analyze and rewrite the FIRST resume. Keep your response under 6000 characters.

Guidelines for rewriting:
- **Tone**: Professional, confident, yet authentic. Avoid being overly formal or flowery
- **Vocabulary**: Replace overused AI buzzwords (e.g., "spearhead", "leverage", "orchestrate", "synergy", "meticulous", "pivotal") with strong, simple action verbs (e.g., "led", "used", "managed", "created", "built")
- **Structure**: Convert passive voice to active voice. Ensure bullet points are punchy and results-oriented
- **Content**: Do NOT summarize. Rewrite the specific bullet points and descriptions to be more impactful. Preserve the original meaning and metrics

Return ONLY a valid JSON object with exactly these fields (no markdown formatting, no code blocks):
{
  "human_score": number (0-100, where 100 is perfectly human),
  "ai_probability": number (0-100, inverse of human_score),
  "verdict": "Human" | "AI" | "Mixed",
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

        // Validate required fields
        if (typeof parsedResponse.human_score !== 'number' || !parsedResponse.rewritten_text) {
          // Fallback if AI misses fields (rare but possible)
          parsedResponse.human_score = parsedResponse.human_score || 50;
          parsedResponse.ai_probability = parsedResponse.ai_probability || 50;
          parsedResponse.verdict = parsedResponse.verdict || "Mixed";
        }
      } catch (parseError) {
        console.error("Failed to parse Claude response:", cleanedResponse.substring(0, 500));

        // Try to recover partial JSON for truncated responses
        try {
          // Check if response was truncated (common with long resumes)
          if (message.stop_reason === 'max_tokens' || cleanedResponse.includes('"rewritten_text"')) {
            // Extract what we can from the partial response
            const humanScoreMatch = cleanedResponse.match(/"human_score"\s*:\s*(\d+)/);
            const aiProbMatch = cleanedResponse.match(/"ai_probability"\s*:\s*(\d+)/);
            const verdictMatch = cleanedResponse.match(/"verdict"\s*:\s*"(Human|AI|Mixed)"/);
            const analysisMatch = cleanedResponse.match(/"analysis"\s*:\s*"([^"]+)"/);

            if (humanScoreMatch) {
              parsedResponse = {
                human_score: parseInt(humanScoreMatch[1]),
                ai_probability: aiProbMatch ? parseInt(aiProbMatch[1]) : 100 - parseInt(humanScoreMatch[1]),
                verdict: verdictMatch ? verdictMatch[1] : "Mixed",
                analysis: analysisMatch ? analysisMatch[1] : "Analysis completed but response was truncated due to document length.",
                rewritten_text: "The rewritten resume was too long to display completely. Please try with a shorter document or a single-page resume for full results."
              };
              console.log("Recovered partial response:", parsedResponse);
            } else {
              throw new Error("Could not recover partial response");
            }
          } else {
            throw new Error("Invalid JSON and not recoverable");
          }
        } catch (recoveryError) {
          console.error("Recovery failed:", recoveryError);
          throw new Error("Invalid AI response format. The document may be too long - please try with a single resume.");
        }
      }

      // Save result to database if user is logged in
      let savedResultId = null;
      if (user && user.id) {
        try {
          const { data: savedData, error: saveError } = await supabase
            .from('saved_results')
            .insert({
              user_id: user.id,
              service_type: 'resume',
              original_content: `Resume: ${file.name}`,
              analyzed_content: { analysis: parsedResponse.analysis },
              result_data: parsedResponse
            })
            .select('id')
            .single();

          if (savedData) {
            savedResultId = savedData.id;
          }
        } catch (saveError) {
          console.error('Error saving result:', saveError);
          // Don't fail the request if saving fails
        }
      }

      const responsePayload = { ...parsedResponse, id: savedResultId };
      const response = NextResponse.json(responsePayload);

      // Deduct credit OR increment visitor cookie
      await deductCreditsOrTrackVisitor(supabase, user, cookieStore, response);

      return response;

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
