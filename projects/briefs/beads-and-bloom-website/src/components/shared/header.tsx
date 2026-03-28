"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
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
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <CldImage
            src="Logo_psn5do"
            alt="Beads & Bloom"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-xl font-semibold tracking-tight">
            Beads &amp; Bloom
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-sm font-medium transition-colors duration-200 hover:text-foreground ${
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-foreground" />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile nav */}
        <MobileNav />
      </div>
    </header>
  );
}
