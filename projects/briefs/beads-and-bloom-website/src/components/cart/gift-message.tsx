"use client";

import { useCartStore } from "@/lib/cart-store";

export function GiftMessage() {
  const giftMessage = useCartStore((s) => s.giftMessage);
  const setGiftMessage = useCartStore((s) => s.setGiftMessage);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor="gift-message"
        className="text-xs font-medium text-muted-foreground"
      >
        Add a gift message (optional)
      </label>
      <textarea
        id="gift-message"
        value={giftMessage}
        onChange={(e) => setGiftMessage(e.target.value)}
        maxLength={150}
        rows={2}
        placeholder="Write a personal note for the recipient..."
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
      />
      <p className="text-right text-xs text-muted-foreground">
        {giftMessage.length}/150
      </p>
    </div>
  );
}
