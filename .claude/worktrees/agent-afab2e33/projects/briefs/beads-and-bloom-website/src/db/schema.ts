import {
  pgTable,
  pgEnum,
  text,
  varchar,
  integer,
  serial,
  numeric,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// Order status enum -- includes "confirmed" for custom orders
export const orderStatusEnum = pgEnum("order_status", [
  "new",
  "confirmed", // Custom orders only: founders reviewed and accepted
  "making",
  "shipped",
  "delivered",
]);

// Product availability enum
export const availabilityEnum = pgEnum("availability", [
  "ready_to_ship",
  "made_to_order",
]);

export const products = pgTable("products", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: text().notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  category: varchar({ length: 100 }).notNull(),
  images: jsonb().$type<string[]>().notNull().default([]),
  colors: jsonb().$type<string[]>().notNull().default([]),
  customizable: boolean().notNull().default(false),
  availability: availabilityEnum().notNull().default("ready_to_ship"),
  inStock: boolean().notNull().default(true),
  featured: boolean().notNull().default(false),
  materials: text(),
  careInfo: text(),
  sortOrder: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 50 }),
  address: jsonb().$type<{
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }>(),
  orderCount: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial().primaryKey(),
  stripeSessionId: varchar({ length: 255 }).unique(),
  customerId: integer().references(() => customers.id),
  status: orderStatusEnum().notNull().default("new"),
  totalAmount: numeric({ precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb()
    .$type<{
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    }>()
    .notNull(),
  giftMessage: text(),
  notes: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial().primaryKey(),
  orderId: integer()
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer()
    .notNull()
    .references(() => products.id),
  quantity: integer().notNull().default(1),
  unitPrice: numeric({ precision: 10, scale: 2 }).notNull(),
  customColors: jsonb().$type<string[]>(),
});

export const charityTotals = pgTable("charity_totals", {
  id: serial().primaryKey(),
  totalDonated: numeric({ precision: 10, scale: 2 }).notNull().default("0"),
  orderCount: integer().notNull().default(0),
  lastUpdated: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
