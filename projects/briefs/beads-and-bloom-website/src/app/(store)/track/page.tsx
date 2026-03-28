"use client";

import { useActionState } from "react";
import { lookupOrder } from "@/actions/track";
import { OrderProgress } from "@/components/track/order-progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

function getStatusMessage(status: string): string {
  switch (status) {
    case "new":
    case "confirmed":
      return "Your order is being prepared";
    case "making":
      return "We're handcrafting your jewelry (5-7 days)";
    case "shipped":
      return "On its way! Estimated 3-5 business days";
    case "delivered":
      return "Delivered!";
    default:
      return "Your order is being prepared";
  }
}

export default function TrackOrderPage() {
  const [state, formAction, isPending] = useActionState(lookupOrder, null);

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">
          Track Your Order
        </h1>
        <p className="mt-2 text-stone-500">
          Enter your order number and email to check the status
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber" className="text-stone-700">
                Order Number
              </Label>
              <Input
                id="orderNumber"
                name="orderNumber"
                type="text"
                placeholder="e.g. 1042"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-stone-700">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              {isPending ? "Looking up..." : "Track Order"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error state */}
      {state?.error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Order not found
              </p>
              <p className="mt-1 text-sm text-amber-700">{state.error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success state -- order found */}
      {state?.order && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-stone-900">
              Order #{state.order.id}
            </CardTitle>
            <CardDescription>
              Placed on{" "}
              {format(new Date(state.order.createdAt), "MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress bar */}
            <OrderProgress status={state.order.status} />

            {/* Status message */}
            <div className="rounded-lg bg-stone-50 p-4 text-center">
              <p className="text-sm font-medium text-teal-700">
                {getStatusMessage(state.order.status)}
              </p>
            </div>

            {/* Order total */}
            <div className="flex items-center justify-between border-t border-stone-200 pt-4">
              <span className="text-sm text-stone-500">Order Total</span>
              <span className="text-lg font-semibold text-stone-900">
                ${state.order.totalAmount}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
