import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required. Robots don't have emails... or do they?" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format. Nice try, robot." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { message: "You're already on the list. We remember you, human." },
        { status: 200 }
      );
    }

    // Add to waitlist
    const { error } = await supabase.from("waitlist").insert({
      email: email.toLowerCase(),
      source: "website",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Waitlist error:", error);
      return NextResponse.json(
        { error: "Database error. The machines may be fighting back." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Welcome to the resistance. Check your inbox for confirmation.",
      success: true,
    });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Stay calm." },
      { status: 500 }
    );
  }
}
