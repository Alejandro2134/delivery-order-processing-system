import OrderTable from "@/components/OrderTable";

const OrdersPage = () => {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Dashboard</h1>
      <OrderTable />
    </main>
  );
};

export default OrdersPage;
