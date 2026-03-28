import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "Admin | Beads & Bloom",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </>
  );
}
