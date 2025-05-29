"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  client: {
    name: string;
  };
  restaurant: {
    name: string;
  };
  status: string;
  robotName: string | null;
};

const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignRobot = async (orderId: number) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "PATCH" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setReload((prev) => !prev);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Server Error";
      setError(errMessage);
    }
  };

  const changeOrderStatus = async (orderId: number) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setReload((prev) => !prev);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Server Error";
      setError(errMessage);
    }
  };

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchOrders();
  }, [reload]);

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}

      <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Client</th>
            <th className="px-4 py-2 text-left">Restaurant</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Robot</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="px-4 py-2">{order.client.name}</td>
              <td className="px-4 py-2">{order.restaurant.name}</td>
              <td className="px-4 py-2 capitalize">{order.status}</td>
              <td className="px-4 py-2">{order.robotName ?? "N/A"}</td>
              <td className="px-4 py-2 space-x-2">
                {!order.robotName && (
                  <button
                    onClick={() => assignRobot(order.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Assign Robot
                  </button>
                )}
                {order.robotName && (
                  <button
                    onClick={() => changeOrderStatus(order.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Update Status
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
