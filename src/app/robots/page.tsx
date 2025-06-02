import RobotTable from "@/components/RobotTable";
import Link from "next/link";

const RobotsPage = () => {
  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Robot Dashboard</h1>
        <Link href="/orders" className="text-blue-600 hover:underline text-sm">
          ← Go to Orders
        </Link>
      </div>
      <RobotTable />
    </main>
  );
};

export default RobotsPage;
