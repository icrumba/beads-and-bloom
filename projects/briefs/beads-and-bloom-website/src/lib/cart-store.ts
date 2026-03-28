"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  giftMessage: string;
  isOpen: boolean;
};

type CartActions = {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number, customColors?: string[]) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    customColors?: string[]
  ) => void;
  setGiftMessage: (message: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
};

type CartStore = CartState & CartActions;

function itemKey(productId: number, customColors?: string[]): string {
  return `${productId}-${(customColors || []).slice().sort().join(",")}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      giftMessage: "",
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const key = itemKey(item.productId, item.customColors);
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.customColors) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.customColors) === key
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (productId, customColors) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              itemKey(i.productId, i.customColors) !==
              itemKey(productId, customColors)
          ),
        })),

      updateQuantity: (productId, quantity, customColors) =>
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.productId, i.customColors) ===
            itemKey(productId, customColors)
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),

      setGiftMessage: (message) =>
        set({ giftMessage: message.slice(0, 150) }),

      clearCart: () => set({ items: [], giftMessage: "" }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + parseFloat(i.price) * i.quantity,
          0
        ),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "beads-bloom-cart",
      partialize: (state) => ({
        items: state.items,
        giftMessage: state.giftMessage,
      }),
    }
  )
);
