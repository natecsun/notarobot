import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/utils/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      const supabase = createAdminClient();
      
      // Upgrade user to Pro
      const { error } = await supabase
        .from("profiles")
        .update({ is_pro: true })
        .eq("id", userId);

      if (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
      
      console.log(`User ${userId} upgraded to Pro!`);
    }
  }

  return NextResponse.json({ received: true });
}
