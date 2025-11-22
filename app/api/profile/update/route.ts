import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, avatar_url } = await req.json();

    // Validate username
    if (username && (username.length < 3 || username.length > 20)) {
      return NextResponse.json({ error: "Username must be between 3 and 20 characters" }, { status: 400 });
    }

    // Check if username is already taken (if changing)
    if (username) {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single();

      if (existingUser) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
      }
    }

    // Update profile
    const updateData: any = {};
    if (username) updateData.username = username;
    if (avatar_url) updateData.avatar_url = avatar_url;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ profile });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
