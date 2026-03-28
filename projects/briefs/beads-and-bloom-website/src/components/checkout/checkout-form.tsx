"use client";

import { useState } from "react";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/actions/stripe";
import type { Address } from "@/types";
import { Loader2, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.email("Please enter a valid email address"),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    line1: z.string().min(1, "Street address is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().default("US"),
  }),
});

type FormErrors = Partial<Record<string, string>>;

type CartItemForCheckout = {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
  customColors?: string[];
};

export function CheckoutForm({
  items,
  giftMessage,
  subtotal,
  onClientSecret,
}: {
  items: CartItemForCheckout[];
  giftMessage: string;
  subtotal: number;
  onClientSecret: (secret: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const shipping = 5.0;
  const total = subtotal + shipping;

  function validateForm(): boolean {
    const result = formSchema.safeParse({
      customerName: name,
      customerEmail: email,
      customerPhone: phone || undefined,
      shippingAddress: {
        line1,
        line2: line2 || undefined,
        city,
        state,
        zip,
        country: "US",
      },
    });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  function handleContinue() {
    if (validateForm()) {
      setStep(2);
    }
  }

  async function handleProceedToPayment() {
    setLoading(true);
    setServerError("");

    try {
      const clientSecret = await createCheckoutSession({
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customColors: item.customColors,
        })),
        customerEmail: email,
        customerName: name,
        customerPhone: phone || undefined,
        shippingAddress: {
          line1,
          line2: line2 || undefined,
          city,
          state,
          zip,
          country: "US",
        },
        giftMessage: giftMessage || undefined,
      });

      onClientSecret(clientSecret);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const errorClass = "text-xs text-red-500 mt-1";

  if (step === 2) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Edit details
        </button>

        <div>
          <h3 className="text-base font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.name}
                  {item.quantity > 1 && ` x${item.quantity}`}
                  {item.customColors && item.customColors.length > 0 && (
                    <span className="text-muted-foreground ml-1">
                      ({item.customColors.join(", ")})
                    </span>
                  )}
                </span>
                <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping (flat rate)</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-1.5 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
          <p className="font-medium">Shipping to:</p>
          <p>{name}</p>
          <p>{line1}{line2 ? `, ${line2}` : ""}</p>
          <p>{city}, {state} {zip}</p>
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <Button
          onClick={handleProceedToPayment}
          disabled={loading}
          className="w-full h-11 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Preparing payment...
            </>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
            {errors["customerName"] && (
              <p className={errorClass}>{errors["customerName"]}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
            {errors["customerEmail"] && (
              <p className={errorClass}>{errors["customerEmail"]}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="line1" className={labelClass}>
              Street Address *
            </label>
            <input
              id="line1"
              type="text"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="123 Main St"
              className={inputClass}
            />
            {errors["shippingAddress.line1"] && (
              <p className={errorClass}>{errors["shippingAddress.line1"]}</p>
            )}
          </div>
          <div>
            <label htmlFor="line2" className={labelClass}>
              Apt / Suite <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="line2"
              type="text"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              placeholder="Apt 4B"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className={labelClass}>
                City *
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className={inputClass}
              />
              {errors["shippingAddress.city"] && (
                <p className={errorClass}>{errors["shippingAddress.city"]}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className={labelClass}>
                State *
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className={inputClass}
              />
              {errors["shippingAddress.state"] && (
                <p className={errorClass}>{errors["shippingAddress.state"]}</p>
              )}
            </div>
          </div>
          <div className="w-1/2">
            <label htmlFor="zip" className={labelClass}>
              ZIP Code *
            </label>
            <input
              id="zip"
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="12345"
              className={inputClass}
            />
            {errors["shippingAddress.zip"] && (
              <p className={errorClass}>{errors["shippingAddress.zip"]}</p>
            )}
          </div>
        </div>
      </div>

      <Button onClick={handleContinue} className="w-full h-11 text-base">
        Continue to Payment
      </Button>
    </div>
  );
}
