import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us -- Beads & Bloom",
  description:
    "Questions about our handmade jewelry? Want a custom color combo? Reach out via email or Instagram DM.",
};

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

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[600px] px-4 pt-12 pb-12">
      <h1 className="text-[24px] font-semibold">Say Hi!</h1>
      <p className="mt-2 text-base text-muted-foreground">
        Got a question? Want a custom color combo? We&apos;d love to hear from
        you!
      </p>

      <div className="mt-8 space-y-4">
        {/* Email */}
        <div className="rounded-lg bg-card p-6">
          <a
            href="mailto:beadsandbloom@email.com"
            className="flex items-center gap-2 text-base hover:text-primary transition-colors"
          >
            <Mail className="h-5 w-5 shrink-0" />
            beadsandbloom@email.com
          </a>
        </div>

        {/* Instagram */}
        <div className="rounded-lg bg-card p-6">
          <a
            href="https://instagram.com/beadsandbloom"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base hover:text-primary transition-colors"
          >
            <InstagramIcon className="h-5 w-5 shrink-0" />
            DM us on Instagram @beadsandbloom
          </a>
        </div>
      </div>
    </div>
  );
}
