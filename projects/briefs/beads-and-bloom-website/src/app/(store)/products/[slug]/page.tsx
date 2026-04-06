import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/queries";
import { PhotoCarousel } from "@/components/shop/photo-carousel";
import { AvailabilityBadge } from "@/components/shop/availability-badge";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { Separator } from "@/components/ui/separator";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const desc = `${product.description.slice(0, 155)}. Handmade with love. $1 donated to charity with every purchase.`;

  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: `${product.name} -- Beads & Bloom`,
      description: desc,
      images: product.images[0]
        ? [
            `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1200,h_630,c_fill/${product.images[0]}`,
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} -- Beads & Bloom`,
      description: desc,
      images: product.images[0]
        ? [
            `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1200,h_630,c_fill/${product.images[0]}`,
          ]
        : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-4">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="md:flex md:gap-8">
        {/* Photos */}
        <div className="md:w-1/2 lg:w-[55%]">
          <PhotoCarousel images={product.images} alt={product.name} />
        </div>

        {/* Product info */}
        <div className="mt-6 md:mt-0 md:w-1/2 lg:w-[45%]">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-1 text-2xl font-semibold text-primary">
            ${parseFloat(product.price).toFixed(2)}
          </p>

          <div className="mt-3">
            <AvailabilityBadge availability={product.availability} />
          </div>

          <Separator className="my-4" />

          <p className="text-base">{product.description}</p>

          {product.materials && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold">Materials</h2>
              <p className="mt-1 text-base text-muted-foreground">
                {product.materials}
              </p>
            </div>
          )}

          {product.materials && product.careInfo && (
            <Separator className="my-4" />
          )}

          {product.careInfo && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold">Care</h2>
              <p className="mt-1 text-base text-muted-foreground">
                {product.careInfo}
              </p>
            </div>
          )}

          <div className="mt-6">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={product.price}
              image={product.images[0] || ""}
              slug={product.slug}
              colors={product.colors}
              customizable={product.customizable}
              inStock={product.inStock}
              category={product.category}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
