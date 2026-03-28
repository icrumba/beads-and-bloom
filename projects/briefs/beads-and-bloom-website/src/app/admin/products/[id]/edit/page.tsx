import { getProductById } from "@/lib/queries";
import { updateProduct } from "@/actions/products";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(parseInt(id, 10));
  if (!product) return { title: "Product Not Found | Admin" };
  return { title: `Edit ${product.name} | Admin` };
}

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(parseInt(id, 10));

  if (!product) {
    notFound();
  }

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <ProductForm product={product} action={boundUpdate} />
    </div>
  );
}
