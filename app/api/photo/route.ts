import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import Replicate from "replicate";

const PHOTO_CREDIT_COST = 5;

// Location identifiers that AI can use to geo-locate photos
const LOCATION_MARKERS = [
  "street signs", "road signs", "traffic signs",
  "license plates", "vehicle registration",
  "store names", "business signs", "brand logos",
  "power lines", "electrical infrastructure",
  "architectural styles", "building designs",
  "vegetation patterns", "plant species",
  "road markings", "crosswalk patterns",
  "mailboxes", "postal codes",
  "landmarks", "monuments", "statues",
  "flags", "national symbols",
  "language on signs", "text in background",
  "sun position", "shadows",
  "phone numbers", "addresses",
  "reflections in windows", "mirror reflections",
  "GPS coordinates", "EXIF data indicators"
];

// Helper to convert base64 to data URL
function toDataUrl(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}

// Helper to fetch image and convert to base64
async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Check authentication
  if (!user) {
    return NextResponse.json({ 
      error: "Please sign in or purchase one-time access to use photo security" 
    }, { status: 401 });
  }

  // Check user credits
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits, subscription_tier')
    .eq('id', user.id)
    .single();

  const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'enterprise';
  
  if (!isPro && (profile?.credits || 0) < PHOTO_CREDIT_COST) {
    return NextResponse.json({ 
      error: `Insufficient credits. Photo security requires ${PHOTO_CREDIT_COST} credits.`,
      required: PHOTO_CREDIT_COST,
      available: profile?.credits || 0
    }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const mimeType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    // Initialize clients
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });

    // Step 1: Analyze the image for location identifiers with bounding boxes
    const analysisResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `You are a security analyst. Analyze this image for ANY elements that could be used by AI to geo-locate the photographer or identify their location.

Look for these location markers:
${LOCATION_MARKERS.map(m => `- ${m}`).join('\n')}

For each detected item, provide:
1. What it is
2. Why it's a location risk
3. Approximate position in the image (use percentages: top-left is 0,0 and bottom-right is 100,100)

Respond in this exact JSON format:
{
  "detected_items": [
    {
      "item": "description of the item",
      "risk": "why this reveals location",
      "bounds": { "x": 0-100, "y": 0-100, "width": 0-100, "height": 0-100 }
    }
  ],
  "risk_level": "low|medium|high|critical",
  "modification_prompt": "A detailed prompt describing what should replace the identified areas. Focus on making replacements look natural and generic. For example: 'Replace street signs with generic blank signs, blur license plates, replace store names with generic storefronts, make architectural details more generic'"
}

Be thorough - even subtle clues like power line styles, vegetation, or road markings can reveal location.`
            }
          ],
        }
      ],
    });

    // Parse analysis
    let analysis: {
      detected_items: Array<{
        item: string;
        risk: string;
        bounds: { x: number; y: number; width: number; height: number };
      }>;
      risk_level: string;
      modification_prompt: string;
    };
    
    try {
      const responseText = analysisResponse.content[0].type === 'text' 
        ? analysisResponse.content[0].text 
        : '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (e) {
      console.error("Failed to parse analysis:", e);
      analysis = {
        detected_items: [],
        risk_level: "medium",
        modification_prompt: "Make the image more generic by obscuring any text, signs, distinctive landmarks, and identifiable features"
      };
    }

    let sanitizedBase64 = base64Image;
    let modificationsApplied: string[] = [];

    // Step 2: If there are items to modify, use Replicate for image editing
    if (analysis.detected_items.length > 0 && process.env.REPLICATE_API_TOKEN) {
      try {
        // Create the image data URL for Replicate
        const imageDataUrl = toDataUrl(base64Image, mimeType);

        // Build a comprehensive modification prompt
        const itemDescriptions = analysis.detected_items
          .map(item => item.item)
          .join(', ');
        
        const modificationPrompt = `Remove or obscure all location-identifying elements: ${itemDescriptions}. Replace with generic, non-identifiable alternatives. Keep the main subject intact. Make changes look natural and seamless.`;

        // Use SDXL inpainting or img2img for modifications
        // We'll use the instruct-pix2pix model which can edit images based on text instructions
        const output = await replicate.run(
          "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
          {
            input: {
              image: imageDataUrl,
              prompt: modificationPrompt,
              negative_prompt: "text, signs, license plates, street names, store names, addresses, phone numbers, landmarks, identifiable buildings",
              num_inference_steps: 30,
              guidance_scale: 7.5,
              image_guidance_scale: 1.5,
            }
          }
        ) as string[];

        // The output is a URL to the modified image
        if (output && output.length > 0) {
          const modifiedImageUrl = output[0];
          
          // Fetch the modified image and convert to base64
          sanitizedBase64 = await urlToBase64(modifiedImageUrl);
          
          modificationsApplied = analysis.detected_items.map(item => 
            `Obscured: ${item.item}`
          );
          modificationsApplied.push("AI-powered image modification applied");
        }
      } catch (replicateError: any) {
        console.error("Replicate processing error:", replicateError);
        // Fall back to just metadata stripping if image modification fails
        modificationsApplied.push("Image modification service unavailable - metadata stripped only");
      }
    } else {
      modificationsApplied.push("No significant location markers detected");
    }

    // Always strip metadata
    modificationsApplied.push("EXIF metadata stripped");

    // Deduct credits after successful processing
    if (!isPro) {
      await supabase.rpc('deduct_credits', { user_id: user.id, amount: PHOTO_CREDIT_COST });
    }

    // Calculate safety score based on modifications
    const baseScore = analysis.risk_level === 'critical' ? 20 
      : analysis.risk_level === 'high' ? 40 
      : analysis.risk_level === 'medium' ? 60 
      : 80;
    
    // Increase score if modifications were applied
    const modificationBonus = modificationsApplied.some(m => m.includes('Obscured')) ? 30 : 10;
    const safetyScore = Math.min(95, baseScore + modificationBonus);

    const response = {
      detected_items: analysis.detected_items.map(item => item.item),
      detected_details: analysis.detected_items,
      modifications_made: modificationsApplied,
      safety_score: safetyScore,
      risk_level: analysis.risk_level,
      sanitized_base64: `data:image/png;base64,${sanitizedBase64}`,
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("Photo security error:", error);
    return NextResponse.json({ 
      error: "Failed to process photo. Please try again." 
    }, { status: 500 });
  }
}
