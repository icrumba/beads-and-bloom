import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  products,
  orders,
  orderItems,
  customers,
  charityTotals,
} from "@/db/schema";

// Select types (reading from DB)
export type Product = InferSelectModel<typeof products>;
export type Order = InferSelectModel<typeof orders>;
export type OrderItem = InferSelectModel<typeof orderItems>;
export type Customer = InferSelectModel<typeof customers>;
export type CharityTotal = InferSelectModel<typeof charityTotals>;

// Insert types (writing to DB)
export type NewProduct = InferInsertModel<typeof products>;
export type NewOrder = InferInsertModel<typeof orders>;
export type NewOrderItem = InferInsertModel<typeof orderItems>;
export type NewCustomer = InferInsertModel<typeof customers>;

// Enum value types
export type OrderStatus = "new" | "confirmed" | "making" | "shipped" | "delivered";
export type Availability = "ready_to_ship" | "made_to_order";

// Address type (shared between customers and orders)
export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

// Cart types
export type CartItem = {
  productId: number;
  name: string;
  price: string; // numeric(10,2) stored as string per Phase 1 convention
  quantity: number;
  image: string; // Cloudinary public ID
  slug: string;
  customColors?: string[]; // Only for customizable products
};
