import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import Stripe from "stripe";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Check DB
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      const r = await sql`SELECT count(*) as count FROM products`;
      results.db = { ok: true, products: r[0].count };
    } catch (e: unknown) {
      results.db = { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  } else {
    results.db = { ok: false, error: "DATABASE_URL not set" };
  }

  // Check Stripe
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const stripePub = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (stripeKey) {
    try {
      const s = new Stripe(stripeKey, { typescript: true });
      const balance = await s.balance.retrieve();
      results.stripe = { ok: true, currency: balance.available?.[0]?.currency };
    } catch (e: unknown) {
      results.stripe = { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  } else {
    results.stripe = { ok: false, error: "STRIPE_SECRET_KEY not set" };
  }

  results.env = {
    hasStripeSecret: !!stripeKey,
    hasStripePub: !!stripePub,
    stripePubPrefix: stripePub?.slice(0, 8),
    hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  };

  return NextResponse.json(results);
}
