import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { sendTelegramAlert } from "@/lib/telegram";
import { createClient } from "@/utils/supabase/server";

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

    // Use paid client
    const client = groqPaid;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Please upload an image under 4MB." },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Image}`;

    // Send to Groq Vision Model
    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are an expert at detecting fake profiles and AI-generated images (GAN/Diffusion artifacts) on dating apps.
                
                Analyze this screenshot. Look for:
                1. Visual Anomalies: Asymmetrical eyes/ears, weird hands, background warping, overly smooth skin texture, mismatched earrings.
                2. Text/Bio Anomalies: Generic "AI" phrasing, inconsistent details, robotic tone.

                Return a JSON object with exactly these fields:
                - "human_score": number (0-100, where 100 is definitely real/human)
                - "ai_probability": number (0-100, inverse of human_score)
                - "verdict": "Real" | "Fake" | "Suspicious"
                - "analysis": "A bulleted list of specific red flags or green flags found."
                
                Be critical but fair.
                `
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl,
                },
              },
            ],
          },
        ],
        model: "llama-3.2-11b-vision-preview",
        temperature: 0.1,
        response_format: { type: "json_object" },
      });

      const responseContent = chatCompletion.choices[0]?.message?.content;

      if (!responseContent) {
        throw new Error("No response from AI");
      }

      const parsedResponse = JSON.parse(responseContent);

      // Save result to database if user is logged in
      let savedResultId = null;
      if (user && user.id) {
        try {
          const { data: savedData, error: saveError } = await supabase
            .from('saved_results')
            .insert({
              user_id: user.id,
              service_type: 'profile',
              original_content: `Profile: ${file.name}`,
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

      // Deduct credit OR increment visitor cookie
      const responsePayload = { ...parsedResponse, id: savedResultId };

      if (user && user.id) {
        await supabase.rpc('deduct_credits', { user_id: user.id, amount: 1 });
      } else {
        const currentUsage = parseInt(cookies().get("visitor_usage")?.value || "0");
        const response = NextResponse.json(responsePayload);
        response.cookies.set("visitor_usage", (currentUsage + 1).toString(), { maxAge: 60 * 60 * 24 * 30 });
        return response;
      }

      return NextResponse.json(responsePayload);

    } catch (groqError: any) {
      if (groqError.status === 429) {
        sendTelegramAlert("CRITICAL: Profile API Rate Limit Hit!");
        return NextResponse.json(
          { error: "System is under heavy load. Please try again shortly." },
          { status: 429 }
        );
      }
      throw groqError;
    }

  } catch (error) {
    console.error("Error analyzing profile:", error);
    return NextResponse.json(
      { error: "Failed to analyze profile." },
      { status: 500 }
    );
  }
}
