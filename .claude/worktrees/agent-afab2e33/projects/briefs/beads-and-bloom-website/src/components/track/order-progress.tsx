"use client";

import { ShoppingBag, Hammer, Truck, CheckCircle } from "lucide-react";

const steps = [
  { key: "new", label: "Ordered", icon: ShoppingBag },
  { key: "making", label: "Making", icon: Hammer },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
] as const;

// Map status to step index (0-based)
function getStepIndex(status: string): number {
  // "confirmed" is treated as equivalent to "new" for display purposes
  if (status === "confirmed" || status === "new") return 0;
  if (status === "making") return 1;
  if (status === "shipped") return 2;
  if (status === "delivered") return 3;
  return 0;
}

export function OrderProgress({ status }: { status: string }) {
  const currentStep = getStepIndex(status);

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isActive = isCompleted || isCurrent;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "bg-stone-200 text-stone-400"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive ? "text-teal-700" : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line (not after last step) */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 mt-[-1.25rem]">
                <div className="h-0.5 w-full rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-teal-600 transition-all duration-500"
                    style={{ width: isCompleted ? "100%" : "0%" }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
