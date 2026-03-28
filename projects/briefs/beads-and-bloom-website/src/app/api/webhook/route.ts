import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createOrder, getOrderByStripeSession } from "@/lib/queries";
import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // a. Get raw body as TEXT -- CRITICAL: not req.json() for signature verification
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // b. Verify webhook signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // c. Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // d. Idempotency check -- prevent duplicate orders on webhook retries
    const existing = await getOrderByStripeSession(session.id);
    if (existing) {
      console.log(
        `Order already exists for session ${session.id}, skipping`
      );
      return NextResponse.json({ received: true });
    }

    // e. Parse metadata (set in createCheckoutSession Server Action)
    const metadata = session.metadata || {};
    const shippingAddress = JSON.parse(metadata.shipping_address || "{}");
    const cartItems = JSON.parse(metadata.cart_items || "[]");
    const giftMessage = metadata.gift_message || undefined;
    const customerName = metadata.customer_name || "Customer";
    const customerPhone = metadata.customer_phone || undefined;
    const customerEmail = session.customer_email || "";

    // f. Get line items from Stripe for price verification
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // g. Calculate total (amount_total is in cents)
    const totalAmount = ((session.amount_total || 0) / 100).toFixed(2);

    // h. Create order in database
    const order = await createOrder({
      stripeSessionId: session.id,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      giftMessage,
      items: cartItems.map(
        (item: { productId: number; quantity: number; price?: string; customColors?: string[] }) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price || "6.00",
          customColors: item.customColors,
        })
      ),
      totalAmount,
    });

    // i. Send confirmation email via Resend
    //    Send from webhook, NOT from confirmation page (reliable, server-side)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Build items list for email from cartItems + lineItems
      const emailItems = lineItems.data
        .filter((li) => li.description !== "Flat-rate shipping")
        .map((li, idx) => ({
          name: li.description || "Beads & Bloom Item",
          quantity: li.quantity || 1,
          price: ((li.amount_total || 0) / 100 / (li.quantity || 1)).toFixed(2),
          customColors: cartItems[idx]?.customColors as string[] | undefined,
        }));

      const subtotal = emailItems
        .reduce(
          (sum: number, item) =>
            sum + parseFloat(item.price) * item.quantity,
          0
        )
        .toFixed(2);

      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "Beads & Bloom <orders@beadsandbloom.com>",
        to: customerEmail,
        subject: `Order Confirmed! Your Beads & Bloom Order #${order.id}`,
        react: OrderConfirmationEmail({
          orderNumber: order.id,
          customerName,
          items: emailItems,
          shippingAddress,
          subtotal,
          shipping: "5.00",
          total: totalAmount,
          giftMessage,
        }),
      });
    } catch (emailErr) {
      // Log but don't fail the webhook -- order is already created
      // Email failure should NOT trigger Stripe retries
      console.error("Failed to send confirmation email:", emailErr);
    }
  }

  // j. Always return 200 to acknowledge receipt (prevents Stripe retries)
  return NextResponse.json({ received: true });
}
