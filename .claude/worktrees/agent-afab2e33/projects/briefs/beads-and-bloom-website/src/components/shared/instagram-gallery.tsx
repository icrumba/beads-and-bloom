import { Camera } from "lucide-react";

/**
 * Gallery image configuration. Replace null entries with Cloudinary public IDs
 * when curated Instagram images are available.
 * Example: { publicId: "beads-and-bloom/instagram/photo-1", alt: "Ocean bracelet" }
 */
const GALLERY_IMAGES: Array<{
  publicId: string;
  alt: string;
} | null> = [null, null, null, null, null, null];

function ImagePlaceholder() {
  return (
    <a
      href="https://instagram.com/beadsandbloom"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center rounded-md bg-secondary aspect-square hover:opacity-80 transition-opacity"
    >
      <Camera className="h-6 w-6 text-muted-foreground/30" />
    </a>
  );
}

export function InstagramGallery() {
  return (
    <section className="py-12">
      <h2 className="text-[24px] font-semibold text-center">
        Follow Our Journey
      </h2>
      <p className="mt-2 text-center">
        <a
          href="https://instagram.com/beadsandbloom"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-semibold text-primary hover:underline"
        >
          @beadsandbloom on Instagram
        </a>
      </p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-1">
        {GALLERY_IMAGES.map((image, index) =>
          image ? (
            // When real images are available, replace with CldImage:
            // <CldImage src={image.publicId} alt={image.alt} ... />
            <a
              key={index}
              href="https://instagram.com/beadsandbloom"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md aspect-square overflow-hidden hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center bg-secondary h-full">
                <Camera className="h-6 w-6 text-muted-foreground/30" />
              </div>
            </a>
          ) : (
            <ImagePlaceholder key={index} />
          )
        )}
      </div>
    </section>
  );
}
