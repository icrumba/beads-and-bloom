"use client";

import { useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, ImageOff } from "lucide-react";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
  action: (formData: FormData) => Promise<void>;
}

const CATEGORIES = ["bracelets", "necklaces", "anklets", "earrings", "sets"];

export function ProductForm({ product, action }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [colors, setColors] = useState<string>(
    product?.colors?.join(", ") ?? ""
  );
  const [availability, setAvailability] = useState<string>(
    product?.availability ?? "ready_to_ship"
  );
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [category, setCategory] = useState(product?.category ?? "");

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={action} className="space-y-8">
      {/* Hidden fields for complex state */}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input
        type="hidden"
        name="colors"
        value={JSON.stringify(
          colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        )}
      />
      <input
        type="hidden"
        name="customizable"
        value={String(
          colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean).length > 0
        )}
      />
      <input type="hidden" name="availability" value={availability} />
      <input type="hidden" name="inStock" value={String(inStock)} />
      <input type="hidden" name="featured" value={String(featured)} />
      <input type="hidden" name="category" value={category} />

      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Info</h2>

        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            required
            maxLength={255}
            defaultValue={product?.name ?? ""}
            placeholder="Ocean Breeze Bracelet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            required
            defaultValue={product?.description ?? ""}
            placeholder="Describe this piece..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            name="price"
            required
            defaultValue={product?.price ?? ""}
            placeholder="6.00"
            pattern="\d+\.\d{2}"
            title="Price must be in format X.XX (e.g., 6.00)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category-input">Category *</Label>
          <Input
            id="category-input"
            list="category-options"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Select or type a category"
          />
          <datalist id="category-options">
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Availability</h2>

        <div className="space-y-2">
          <Label>Availability</Label>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ready_to_ship">Ready to Ship</SelectItem>
              <SelectItem value="made_to_order">Made to Order</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="in-stock-switch">In Stock</Label>
          <Switch
            id="in-stock-switch"
            checked={inStock}
            onCheckedChange={setInStock}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="featured-switch">Featured</Label>
          <Switch
            id="featured-switch"
            checked={featured}
            onCheckedChange={setFeatured}
          />
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Images</h2>

        <div className="grid grid-cols-4 gap-2">
          {images.map((publicId, index) => (
            <div key={publicId} className="relative group">
              <CldImage
                src={publicId}
                alt={`Product image ${index + 1}`}
                width={80}
                height={80}
                crop="fill"
                className="rounded-md object-cover w-full aspect-square"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-4 flex items-center justify-center h-20 rounded-md border border-dashed text-muted-foreground">
              <ImageOff className="h-5 w-5 mr-2" />
              <span className="text-sm">No images yet</span>
            </div>
          )}
        </div>

        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(result) => {
            if (
              typeof result?.info === "object" &&
              "public_id" in result.info
            ) {
              setImages((prev) => [...prev, result.info.public_id as string]);
            }
          }}
          options={{
            multiple: true,
            maxFiles: 10,
            sources: ["local", "camera"],
          }}
        >
          {({ open }) => (
            <Button type="button" variant="outline" onClick={() => open()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          )}
        </CldUploadWidget>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Details</h2>

        <div className="space-y-2">
          <Label htmlFor="colors">Colors (comma-separated)</Label>
          <Input
            id="colors"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="ocean blue, sandy beige, coral pink"
          />
          {colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {colors
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
                .map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-teal-50 text-teal-700 border border-teal-200"
                  >
                    {color}
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="materials">Materials</Label>
          <Textarea
            id="materials"
            name="materials"
            defaultValue={product?.materials ?? ""}
            placeholder="Glass beads, stretch cord"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="careInfo">Care Info</Label>
          <Textarea
            id="careInfo"
            name="careInfo"
            defaultValue={product?.careInfo ?? ""}
            placeholder="Avoid water and harsh chemicals"
          />
        </div>
      </div>

      {/* Advanced */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Advanced</h2>

        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
            min={0}
          />
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg">
        {product ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
