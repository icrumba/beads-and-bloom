import { getAdminOrders } from "@/lib/queries";
import { OrderTable } from "@/components/admin/order-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Orders</h1>
      <p className="mt-1 text-sm text-stone-500">
        Track and manage all customer orders.
      </p>
      <div className="mt-6">
        <OrderTable data={orders} />
      </div>
    </div>
  );
}
