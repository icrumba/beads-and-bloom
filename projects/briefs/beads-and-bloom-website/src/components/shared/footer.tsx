import Link from "next/link";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const quickLinks = [
  { label: "Shop", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/shipping#returns" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-4 py-14">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight">
              Beads &amp; Bloom
            </p>
            <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Handmade ocean-inspired jewelry by twin sisters. $1 from every
              order goes to charity.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="https://instagram.com/beadsandbloom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <InstagramIcon className="h-4 w-4" />
            @beadsandbloom
          </a>
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Beads &amp; Bloom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
