"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = ["all", "bracelets", "necklaces"] as const;

function CategoryTabsInner({ active }: { active: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}#all-products` : "/#all-products", { scroll: false });
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleChange(cat)}
          className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all duration-200 ${
            active === cat
              ? "bg-foreground text-background shadow-sm"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export { CategoryTabsInner as CategoryTabs };
