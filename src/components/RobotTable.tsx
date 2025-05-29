"use client";

import { useEffect, useState } from "react";

type Robot = {
  id: number;
  robotId: string;
  status: string;
  lastKnownLocation: string;
};

const RobotTable = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRobots = async () => {
    const res = await fetch("/api/robots");
    const data = await res.json();
    setRobots(data);
  };

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
  }, [reload]);

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}

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
