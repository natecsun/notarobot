import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all user data
    const [profile, savedResults, creditPurchases, leaderboard] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('saved_results').select('*').eq('user_id', user.id),
      supabase.from('credit_purchases').select('*').eq('user_id', user.id),
      supabase.from('leaderboard').select('*').eq('user_id', user.id)
    ]);

    const exportData = {
      profile: profile.data,
      saved_results: savedResults.data || [],
      credit_purchases: creditPurchases.data || [],
      leaderboard_entries: leaderboard.data || [],
      export_date: new Date().toISOString(),
      version: "1.0"
    };

    // Return as JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="notarobot-data-${user.id}.json"`
      }
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
