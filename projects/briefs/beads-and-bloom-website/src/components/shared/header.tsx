"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/shared/mobile-nav";

const navItems = [
  { label: "Shop", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between px-4">
      <Link href="/" className="text-xl font-semibold">
        Beads &amp; Bloom
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-semibold transition-colors hover:text-primary ${
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile nav */}
      <MobileNav />
    </header>
  );
}
