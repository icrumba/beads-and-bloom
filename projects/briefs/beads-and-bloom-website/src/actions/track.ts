"use server";

import { z } from "zod/v4";
import { getOrderByIdAndEmail } from "@/lib/queries";

const trackSchema = z.object({
  orderNumber: z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) throw new Error("Invalid order number");
    return num;
  }),
  email: z.email("Please enter a valid email address"),
});

type TrackResult = {
  order?: {
    id: number;
    status: string;
    createdAt: Date;
    totalAmount: string;
  };
  error?: string;
};

export async function lookupOrder(
  _prevState: TrackResult | null,
  formData: FormData
): Promise<TrackResult> {
  const raw = {
    orderNumber: formData.get("orderNumber") as string,
    email: formData.get("email") as string,
  };

  // Validate input
  let parsed;
  try {
    parsed = trackSchema.parse(raw);
  } catch {
    return {
      error:
        "Please enter a valid order number and email address.",
    };
  }

  const order = await getOrderByIdAndEmail(
    parsed.orderNumber,
    parsed.email.toLowerCase().trim()
  );

  if (!order) {
    return {
      error:
        "We couldn't find that order. Double-check your order number and email.",
    };
  }

  return { order };
}
