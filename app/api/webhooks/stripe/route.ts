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

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const type = session.metadata?.type;

    if (!userId) {
      console.error('No userId in session metadata');
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (type === 'credits') {
      const credits = parseInt(session.metadata?.credits || '0');
      const amount = parseFloat(session.metadata?.amount || '0');

      if (credits > 0) {
        // Record credit purchase
        const { error: purchaseError } = await supabase
          .from('credit_purchases')
          .insert({
            user_id: userId,
            stripe_payment_intent_id: session.payment_intent as string,
            credits_purchased: credits,
            amount_paid: amount,
            status: 'completed'
          });

        if (purchaseError) {
          console.error('Error recording credit purchase:', purchaseError);
        }

        // Add credits via RPC
        const { error } = await supabase.rpc('add_credits', {
          user_id: userId,
          amount: credits
        });

        if (error) {
          console.error('Error adding credits:', error);
          return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
        }

        console.log(`Added ${credits} credits to user ${userId}`);
      }
    } else if (type === 'subscription') {
      const plan = session.metadata?.plan;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      if (plan && subscriptionId) {
        // Create subscription record
        const { error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_type: plan,
            status: 'active',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          });

        if (subError) {
          console.error('Error creating subscription:', subError);
        }

        // Update user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_status: 'active',
            plan_type: plan,
          })
          .eq('id', userId);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        // Add initial credits for subscription
        const initialCredits = plan === 'pro' ? 1000 : 5000;
        const { error: creditError } = await supabase.rpc('add_credits', {
          user_id: userId,
          amount: initialCredits
        });

        if (creditError) {
          console.error('Error adding subscription credits:', creditError);
        }

        console.log(`Created ${plan} subscription for user ${userId}`);
      }
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as any;
    const subscriptionId = invoice.subscription;

    if (subscriptionId) {
      // Update subscription status and add monthly credits
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('user_id, plan_type')
        .eq('stripe_subscription_id', subscriptionId)
        .single();

      if (subscription) {
        const monthlyCredits = subscription.plan_type === 'pro' ? 1000 : 5000;
        
        await supabase.rpc('add_credits', {
          user_id: subscription.user_id,
          amount: monthlyCredits
        });

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_end: new Date(invoice.period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscriptionId);

        console.log(`Renewed subscription for user ${subscription.user_id}`);
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;

    // Update subscription status
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscriptionId);

    // Update user profile
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (subData) {
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'canceled',
          plan_type: 'free'
        })
        .eq('id', subData.user_id);
    }

    console.log(`Canceled subscription ${subscriptionId}`);
  }

  return NextResponse.json({ received: true });
}
