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
    <footer className="bg-secondary py-12 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Tagline */}
        <p className="text-base font-semibold">Beads &amp; Bloom</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Handmade with love by twin sisters.
        </p>

        {/* Quick links */}
        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Instagram + Copyright */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="https://instagram.com/beadsandbloom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <InstagramIcon className="h-4 w-4" />
            @beadsandbloom
          </a>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Beads &amp; Bloom
          </p>
        </div>
      </div>
    </footer>
  );
}
