import { getAllProducts } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductDeleteDialog } from "@/components/admin/product-delete-dialog";
import { CldImage } from "next-cloudinary";
import { Plus, Pencil, Package, ImageOff } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const productList = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {productList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold">No products yet</h2>
            <p className="text-muted-foreground mt-1">
              Add your first product to get started!
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productList.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* Product thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <CldImage
                        src={product.images[0]}
                        alt={product.name}
                        width={80}
                        height={80}
                        crop="fill"
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <ImageOff className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-lg font-medium text-teal-700">
                      ${product.price}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <Badge
                        variant={
                          product.availability === "ready_to_ship"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {product.availability === "ready_to_ship"
                          ? "Ready to Ship"
                          : "Made to Order"}
                      </Badge>
                      {!product.inStock && (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                      {product.featured && (
                        <Badge
                          className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-100"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <ProductDeleteDialog
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
