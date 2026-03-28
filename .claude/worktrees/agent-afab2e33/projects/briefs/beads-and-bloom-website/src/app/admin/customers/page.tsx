import { getAdminCustomers } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers | Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customerList = await getAdminCustomers();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Customers</h1>
      <p className="mt-1 text-sm text-stone-500">
        Everyone who has placed an order.
      </p>

      <div className="mt-6 space-y-4">
        {customerList.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-stone-500">
              No customers yet. Orders will appear here.
            </p>
          </Card>
        ) : (
          customerList.map((customer) => {
            const address = customer.address as {
              line1: string;
              line2?: string;
              city: string;
              state: string;
              zip: string;
              country: string;
            } | null;

            return (
              <Card key={customer.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-stone-900">
                      {customer.name}
                    </h3>
                    <a
                      href={`mailto:${customer.email}`}
                      className="mt-1 flex items-center gap-1.5 text-sm text-teal-700 hover:underline"
                    >
                      <Mail className="size-3.5" />
                      {customer.email}
                    </a>
                    {customer.phone && (
                      <a
                        href={`tel:${customer.phone}`}
                        className="mt-1 flex items-center gap-1.5 text-sm text-teal-700 hover:underline"
                      >
                        <Phone className="size-3.5" />
                        {customer.phone}
                      </a>
                    )}
                  </div>
                  <div className="text-right text-sm text-stone-500">
                    <p className="flex items-center gap-1">
                      <Package className="size-3.5" />
                      {customer.orderCount}{" "}
                      {customer.orderCount === 1 ? "order" : "orders"}
                    </p>
                    <p className="mt-1">
                      Since {format(new Date(customer.createdAt), "MMM yyyy")}
                    </p>
                  </div>
                </div>

                {address && (
                  <div className="mt-3 flex items-start gap-1.5 text-sm text-stone-500">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""},{" "}
                      {address.city}, {address.state} {address.zip}
                    </span>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
