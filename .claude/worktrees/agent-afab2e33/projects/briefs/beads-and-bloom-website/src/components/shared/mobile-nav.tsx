"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const navItems = [
  { label: "Shop", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" />
        }
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item) => (
            <SheetClose key={item.href} render={<Link href={item.href} />}>
              <span
                className={`flex h-12 items-center text-base font-semibold ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </span>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
