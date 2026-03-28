"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { CldImage } from "next-cloudinary";

export function PhotoCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setSlideRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      slideRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = slideRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        }
      },
      { root: container, threshold: 0.5 }
    );

    for (const slide of slideRefs.current) {
      if (slide) observer.observe(slide);
    }

    return () => observer.disconnect();
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
        No photo available
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <CldImage
        src={images[0]}
        alt={alt}
        width={800}
        height={800}
        crop="fill"
        format="auto"
        quality="auto"
        sizes="100vw"
        className="w-full"
      />
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div
            key={src}
            ref={setSlideRef(i)}
            className="w-full flex-none snap-center"
          >
            <CldImage
              src={src}
              alt={`${alt} - photo ${i + 1}`}
              width={800}
              height={800}
              crop="fill"
              format="auto"
              quality="auto"
              sizes="100vw"
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
