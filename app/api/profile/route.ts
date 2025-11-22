import { NextResponse } from "next/server";
import Groq from "groq-sdk";

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
      const chatCompletion = await groq.chat.completions.create({
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

                Return a JSON object with:
                - "fake_probability": number between 0-100
                - "verdict": "Likely Real" or "Likely Fake" or "Suspicious"
                - "analysis": A bulleted list of specific red flags or green flags found.
                
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

      return NextResponse.json(JSON.parse(responseContent));
      
    } catch (groqError: any) {
      if (groqError.status === 429) {
        sendTelegramAlert("RATE LIMIT HIT: Profile Spotter API (429)");
        return NextResponse.json(
          { error: "Traffic is high! We hit the free tier limit. Please try again in a minute." },
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
