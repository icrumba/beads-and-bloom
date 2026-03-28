"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["all", "bracelets", "necklaces", "accessories"] as const;

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
    router.push(qs ? `/?${qs}` : "/");
  }

  return (
    <Tabs value={active} onValueChange={handleChange}>
      <TabsList variant="line" className="overflow-x-auto">
        {categories.map((cat) => (
          <TabsTrigger
            key={cat}
            value={cat}
            className="text-sm font-semibold capitalize"
          >
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export { CategoryTabsInner as CategoryTabs };
