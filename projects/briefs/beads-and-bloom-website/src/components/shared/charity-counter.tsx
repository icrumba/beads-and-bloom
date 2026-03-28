"use client";

import { useEffect, useRef, useState } from "react";

interface CharityCounterProps {
  total: number;
}

export function CharityCounter({ total }: CharityCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const duration = 2000;
          const startTime = performance.now();

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic: 1 - (1 - progress)^3
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * total);

            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [total, hasAnimated]);

  return (
    <div
      ref={ref}
      className="rounded-lg bg-secondary px-4 py-12 text-center"
    >
      <p className="text-[32px] font-semibold text-primary">
        ${displayValue}
      </p>
      <p className="mt-1 text-base text-muted-foreground">
        donated and counting!
      </p>
    </div>
  );
}
