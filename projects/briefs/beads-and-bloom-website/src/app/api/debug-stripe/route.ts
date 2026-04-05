import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: "No STRIPE_SECRET_KEY" });

  const stripe = new Stripe(key, { typescript: true });

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Test Item" },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      return_url: "https://www.beadsandbloom.org/order/confirmation?session_id={CHECKOUT_SESSION_ID}",
    });

    return NextResponse.json({
      ok: true,
      sessionId: session.id,
      hasClientSecret: !!session.client_secret,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg });
  }
}
