import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, planId, credits } = await req.json();

    if (type === 'subscription') {
      // Handle subscription checkout
      const prices = {
        pro: process.env.STRIPE_PRICE_ID_PRO,
        enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE
      };

      const priceId = prices[planId as keyof typeof prices];

      if (!priceId) {
        console.error(`Missing Price ID for plan: ${planId}`);
        return NextResponse.json({ error: "Price ID not configured" }, { status: 500 });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          type: 'subscription',
          plan: planId,
        },
        subscription_data: {
          metadata: {
            userId: user.id,
            plan: planId,
          },
        },
      });

      return NextResponse.json({ url: session.url });
    } else if (type === 'credits') {
      // Handle credit purchase
      const creditPackages = {
        100: { amount: 999, credits: 100, name: "100 AI Credits" },
        500: { amount: 3999, credits: 500, name: "500 AI Credits" },
        1000: { amount: 6999, credits: 1000, name: "1000 AI Credits" },
      };

      const pkg = creditPackages[credits as keyof typeof creditPackages];
      if (!pkg) {
        return NextResponse.json({ error: "Invalid credit package" }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: pkg.name,
                description: `One-time purchase of ${pkg.credits} credits for AI analysis`,
              },
              unit_amount: pkg.amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          type: 'credits',
          credits: pkg.credits.toString(),
          amount: (pkg.amount / 100).toString(),
        },
      });

      return NextResponse.json({ url: session.url });
    } else if (type === 'photo_security') {
      // Handle one-time photo security purchase ($3.99)
      const { returnUrl } = await req.json().catch(() => ({}));
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Anti AI Spy - Photo Security",
                description: "One-time photo security service: Remove location-identifiable elements from your photo to prevent AI geo-location tracking.",
              },
              unit_amount: 399, // $3.99
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: returnUrl 
          ? `${returnUrl}?photo_success=true&session_id={CHECKOUT_SESSION_ID}`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/services/photo?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: returnUrl 
          ? `${returnUrl}?canceled=true`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/services/photo?canceled=true`,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          type: 'photo_security',
          service: 'anti_ai_spy',
        },
      });

      return NextResponse.json({ url: session.url });
    } else {
      return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
