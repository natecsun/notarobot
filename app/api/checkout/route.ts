import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "NotARobot Pro",
              description: "Unlimited AI Resume Sanitization & Profile Checks",
            },
            unit_amount: 1000, // $10.00 USD
          },
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment. Use 'subscription' if you want recurring.
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
