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
      className="gradient-section relative overflow-hidden rounded-3xl px-6 py-16 text-center"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-emerald-200/20 blur-3xl" />

      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Together we&apos;ve donated
      </p>
      <p className="mt-3 text-5xl font-semibold tracking-tight md:text-6xl">
        <span style={{ color: "#7BA7CC" }}>
          ${displayValue}
        </span>
      </p>
      <p className="mt-2 text-base text-muted-foreground">
        to{" "}
        <a
          href="https://www.thestorehousecc.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline decoration-emerald-300 underline-offset-2 transition-colors hover:text-emerald-600"
        >
          The Storehouse
        </a>
        {" "}&mdash; feeding families in North Dallas
      </p>
    </div>
  );
}
