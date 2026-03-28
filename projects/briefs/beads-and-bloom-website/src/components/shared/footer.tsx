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
  { label: "Our Story", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/shipping#returns" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-4 py-14">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <img
                src="https://res.cloudinary.com/dmz3werfw/image/upload/w_72,h_72,c_fill,f_auto/Logo_psn5do"
                alt="Beads & Bloom"
                width={36}
                height={36}
                className="rounded-full"
              />
              <p className="text-lg font-semibold tracking-tight">
                Beads &amp; Bloom
              </p>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Handmade ocean-inspired jewelry by 13-year-old twin sisters.
              Every purchase donates $1 to The Storehouse to help feed families
              in need.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Quick Links
            </p>
            <nav className="flex flex-col gap-2">
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

          {/* Charity Partner */}
          <div className="max-w-xs">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Our Charity Partner
            </p>
            <a
              href="https://www.thestorehousecc.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
            >
              The Storehouse Community Center
            </a>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Feeding, clothing, and caring for North Dallas neighbors.
              1,200+ families served weekly.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Beads &amp; Bloom. Made with love by two sisters who
            believe small acts change the world.
          </p>
        </div>
      </div>
    </footer>
  );
}
