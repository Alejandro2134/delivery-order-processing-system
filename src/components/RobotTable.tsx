"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";

type Robot = {
  id: number;
  robotId: string;
  status: string;
  lastKnownLocation: string;
};

type Filter = {
  [filter: string]: string;
  lastKnownLocation: string;
  status: string;
  robot: string;
};

const RobotTable = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filter>({
    lastKnownLocation: "",
    robot: "",
    status: "",
  });

  const fetchRobots = useCallback(async () => {
    const params = new URLSearchParams();

    for (const filter in filters)
      if (filters[filter]) params.append(filter, filters[filter]);

    const res = await fetch(`/api/robots?${params.toString()}`);
    const data = await res.json();
    setRobots(data);
  }, [filters]);

  const changeRobotStatus = async (newStatus: string, robotId: number) => {
    try {
      const res = await fetch(`/api/robots/${robotId}`, {
        body: JSON.stringify({
          status: newStatus,
        }),
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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchRobots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchRobots();
    }, 500);

    return () => clearTimeout(timeout);
  }, [filters, fetchRobots]);

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}

      <div className="mb-4 mt-1 ml-1 mr-1 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input
          type="text"
          placeholder="Search Robot ID"
          className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.robot}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFilters({ ...filters, robot: e.target.value })
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
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
        <input
          type="text"
          placeholder="Search Last Known Location"
          className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.lastKnownLocation}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFilters({ ...filters, lastKnownLocation: e.target.value })
          }
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Robot ID</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Last Known Location</th>
            <th className="px-4 py-2 text-left">Change Status</th>
          </tr>
        </thead>
        <tbody>
          {robots.map((robot) => (
            <tr key={robot.id} className="border-t">
              <td className="px-4 py-2">{robot.robotId}</td>
              <td className="px-4 py-2 capitalize">{robot.status}</td>
              <td className="px-4 py-2">{robot.lastKnownLocation}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => changeRobotStatus("available", robot.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Available
                </button>
                <button
                  onClick={() => changeRobotStatus("busy", robot.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Busy
                </button>
                <button
                  onClick={() => changeRobotStatus("offline", robot.id)}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Offline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RobotTable;
