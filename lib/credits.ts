import { SupabaseClient } from "@supabase/supabase-js";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { VISITOR_LIMIT, VISITOR_COOKIE_NAME, VISITOR_COOKIE_MAX_AGE } from "./config";

export type CreditCheckResult = {
    allowed: boolean;
    error?: string;
    status?: number;
    isVisitor: boolean;
    user?: any;
};

export async function checkUserCreditsOrVisitorLimit(
    supabase: SupabaseClient,
    user: any,
    cookieStore: ReadonlyRequestCookies
): Promise<CreditCheckResult> {
    // Visitor Logic (No User)
    if (!user) {
        const usageCount = parseInt(cookieStore.get(VISITOR_COOKIE_NAME)?.value || "0");
        if (usageCount >= VISITOR_LIMIT) {
            return {
                allowed: false,
                error: "Visitor limit reached. Please sign up for 50 free credits.",
                status: 403,
                isVisitor: true
            };
        }
        return { allowed: true, isVisitor: true };
    }

    // User Logic (Check Credits)
    const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

    if (!profile || (profile.credits || 0) < 1) {
        return {
            allowed: false,
            error: "Insufficient credits. Please buy more.",
            status: 403,
            isVisitor: false,
            user
        };
    }

    return { allowed: true, isVisitor: false, user };
}

export async function deductCreditsOrTrackVisitor(
    supabase: SupabaseClient,
    user: any,
    cookieStore: ReadonlyRequestCookies,
    response: any // NextResponse
) {
    if (user && user.id) {
        await supabase.rpc('deduct_credits', { user_id: user.id, amount: 1 });
    } else {
        // Increment visitor usage
        const currentUsage = parseInt(cookieStore.get(VISITOR_COOKIE_NAME)?.value || "0");
        response.cookies.set(VISITOR_COOKIE_NAME, (currentUsage + 1).toString(), { maxAge: VISITOR_COOKIE_MAX_AGE });
    }
}
