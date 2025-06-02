import OrderTable from "@/components/OrderTable";
import Link from "next/link";

const OrdersPage = () => {
  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Order Dashboard</h1>
        <Link href="/robots" className="text-blue-600 hover:underline text-sm">
          Go to Robots →
        </Link>
      </div>
      <OrderTable />
    </main>
  );
};

export default OrdersPage;
