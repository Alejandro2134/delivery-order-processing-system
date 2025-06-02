"use client";

import { useEffect, useState, Fragment, ChangeEvent, useCallback } from "react";

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
  items: { description: string; unitPrice: string; quantity: number }[];
};

type Filter = {
  [filter: string]: string;
  client: string;
  restaurant: string;
  status: string;
  robot: string;
};

const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filter>({
    client: "",
    restaurant: "",
    robot: "",
    status: "",
  });

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

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams();

    for (const filter in filters)
      if (filters[filter]) params.append(filter, filters[filter]);

    const res = await fetch(`/api/orders?${params.toString()}`);
    const data = await res.json();
    setOrders(data);
  }, [filters]);

  const toggleExpand = (orderId: number) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(timeout);
  }, [filters, fetchOrders]);

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}

      <div className="mb-4 mt-1 ml-1 mr-1 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input
          type="text"
          placeholder="Search Client"
          className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.client}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFilters({ ...filters, client: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Search Restaurant"
          className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.restaurant}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFilters({ ...filters, restaurant: e.target.value })
          }
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={filters.status}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="picked_up">Picked Up</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="text"
          placeholder="Search Robot"
          className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.robot}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFilters({ ...filters, robot: e.target.value })
          }
        />
      </div>

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
            <Fragment key={order.id}>
              <tr className="border-t">
                <td className="px-4 py-2 flex items-center gap-2">
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="text-sm"
                  >
                    {expandedOrders.includes(order.id) ? "🔼" : "🔽"}
                  </button>
                  {order.client.name}
                </td>
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
                  {order.robotName && order.status !== "completed" && (
                    <button
                      onClick={() => changeOrderStatus(order.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Update Status
                    </button>
                  )}
                </td>
              </tr>

              {expandedOrders.includes(order.id) && (
                <tr className="bg-gray-50">
                  <td colSpan={5} className="px-4 py2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left px-2 py-1">Description</th>
                          <th className="text-left px-2 py-1">Quantity</th>
                          <th className="text-left px-2 py-1">Unit Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-2 py-1">{item.description}</td>
                            <td className="px-2 py-1">{item.quantity}</td>
                            <td className="px-2 py-1">{item.unitPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
