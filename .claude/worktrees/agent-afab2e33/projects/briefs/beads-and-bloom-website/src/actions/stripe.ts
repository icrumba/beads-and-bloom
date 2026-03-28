"use server";

import { z } from "zod/v4";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";


const checkoutItemSchema = z.object({
  productId: z.number(),
  name: z.string(),
  price: z.string(),
  quantity: z.number().int().min(1),
  customColors: z.array(z.string()).optional(),
});

const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Cart cannot be empty"),
  customerEmail: z.email("Invalid email address"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    line1: z.string().min(1, "Street address is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().default("US"),
  }),
  giftMessage: z.string().max(150).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export async function createCheckoutSession(input: CheckoutInput) {
  // Validate input
  const parsed = checkoutSchema.parse(input);

  // CRITICAL: Look up product prices server-side -- never trust client prices
  const itemIds = parsed.items.map((item) => item.productId);
  const dbProducts = await db
    .select({ id: products.id, name: products.name, price: products.price })
    .from(products)
    .where(inArray(products.id, itemIds));

  // Build a price map from DB results
  const priceMap = new Map(dbProducts.map((p) => [p.id, p]));

  // Verify all products exist
  for (const item of parsed.items) {
    if (!priceMap.has(item.productId)) {
      throw new Error(`Product not found: ${item.name}`);
    }
  }

  // Build Stripe line items using server-side prices
  const lineItems = parsed.items.map((item) => {
    const dbProduct = priceMap.get(item.productId)!;
    return {
      price_data: {
        currency: "usd" as const,
        product_data: { name: dbProduct.name },
        unit_amount: Math.round(parseFloat(dbProduct.price) * 100),
      },
      quantity: item.quantity,
    };
  });

  // Add flat-rate shipping as a line item (D-07: $5 flat rate)
  lineItems.push({
    price_data: {
      currency: "usd" as const,
      product_data: { name: "Flat-rate shipping" },
      unit_amount: 500,
    },
    quantity: 1,
  });

  // Build cart items metadata for webhook to reconstruct order
  const cartItemsMeta = parsed.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    customColors: item.customColors,
  }));

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    line_items: lineItems,
    customer_email: parsed.customerEmail,
    metadata: {
      customer_name: parsed.customerName,
      customer_phone: parsed.customerPhone || "",
      shipping_address: JSON.stringify(parsed.shippingAddress),
      gift_message: parsed.giftMessage || "",
      cart_items: JSON.stringify(cartItemsMeta),
    },
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret!;
}
