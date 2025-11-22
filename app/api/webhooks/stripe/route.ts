import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe";
import { createAdminClient } from "@/utils/supabase/admin";

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
    const amount = parseInt(session.metadata?.amount || '0');

    if (userId && amount > 0) {
      const supabase = createAdminClient();

      // Add credits via RPC
      const { error } = await supabase.rpc('add_credits', {
        user_id: userId,
        amount: amount
      });

      if (error) {
        console.error('Error adding credits:', error);
        return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
