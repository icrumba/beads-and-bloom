"use server";

import { z } from "zod/v4";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+\.\d{2}$/, "Price must be in format X.XX"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  customizable: z.boolean().default(false),
  availability: z
    .enum(["ready_to_ship", "made_to_order"])
    .default("ready_to_ship"),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  materials: z.string().optional(),
  careInfo: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractFormData(formData: FormData) {
  const imagesRaw = formData.get("images") as string;
  const colorsRaw = formData.get("colors") as string;

  let images: string[] = [];
  try {
    images = imagesRaw ? JSON.parse(imagesRaw) : [];
  } catch {
    images = [];
  }

  let colors: string[] = [];
  try {
    colors = colorsRaw ? JSON.parse(colorsRaw) : [];
  } catch {
    colors = [];
  }

  return {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    category: formData.get("category") as string,
    images,
    colors,
    customizable: formData.get("customizable") === "true",
    availability: (formData.get("availability") as string) || "ready_to_ship",
    inStock: formData.get("inStock") !== "false",
    featured: formData.get("featured") === "true",
    materials: (formData.get("materials") as string) || undefined,
    careInfo: (formData.get("careInfo") as string) || undefined,
    sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10) || 0,
  };
}

export async function createProduct(formData: FormData) {
  const raw = extractFormData(formData);
  const parsed = productSchema.parse(raw);
  const slug = generateSlug(parsed.name);

  await db
    .insert(products)
    .values({
      ...parsed,
      slug,
      materials: parsed.materials ?? null,
      careInfo: parsed.careInfo ?? null,
    })
    .returning();

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: number, formData: FormData) {
  const raw = extractFormData(formData);
  const parsed = productSchema.parse(raw);
  const slug = generateSlug(parsed.name);

  await db
    .update(products)
    .set({
      ...parsed,
      slug,
      materials: parsed.materials ?? null,
      careInfo: parsed.careInfo ?? null,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/admin/products");
  revalidatePath("/admin/products/" + id + "/edit");
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");

  return { success: true };
}
