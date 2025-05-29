import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Select a view to manage the system.</p>
        <div className="flex flex-col gap-4">
          <Link href="/orders">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow transition">
              Order Dashboard
            </button>
          </Link>
          <Link href="/robots">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow transition">
              Robot Manager
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
