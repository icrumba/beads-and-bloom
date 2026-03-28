// Cart store -- stub for parallel build (Plan 01 provides full implementation)
// This file will be replaced/merged when Plan 01 completes.

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
  customColors?: string[];
};

type CartStore = {
  items: CartItem[];
  giftMessage: string;
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
};

function cartItemKey(productId: number, customColors?: string[]) {
  return `${productId}-${(customColors || []).sort().join(",")}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      giftMessage: "",
      addItem: (item) =>
        set((state) => {
          const key = cartItemKey(item.productId, item.customColors);
          const existing = state.items.find(
            (i) => cartItemKey(i.productId, i.customColors) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                cartItemKey(i.productId, i.customColors) === key
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
              !(
                i.productId === productId &&
                JSON.stringify(i.customColors?.sort()) ===
                  JSON.stringify(customColors?.sort())
              )
          ),
        })),
      updateQuantity: (productId, quantity, customColors) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId &&
            JSON.stringify(i.customColors?.sort()) ===
              JSON.stringify(customColors?.sort())
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      setGiftMessage: (message) => set({ giftMessage: message.slice(0, 150) }),
      clearCart: () => set({ items: [], giftMessage: "" }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + parseFloat(i.price) * i.quantity,
          0
        ),
    }),
    { name: "beads-bloom-cart" }
  )
);
