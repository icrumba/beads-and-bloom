import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://beadsandbloom.com"
  ),
  title: {
    default: "Beads & Bloom -- Handmade Ocean-Inspired Jewelry",
    template: "%s | Beads & Bloom",
  },
  description:
    "Handmade jewelry by teen twin sisters. Every purchase donates $1 to charity. Sea turtle, starfish, and shell charm bracelets and necklaces.",
  openGraph: {
    type: "website",
    siteName: "Beads & Bloom",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
