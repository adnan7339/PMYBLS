import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => setTotal(data.total))
      .catch(() => setTotal(0));
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Total Records */}
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Applicants</p>
          <h2 className="text-3xl font-bold">{total}</h2>
        </div>

        {/* Upload */}
        <a
          href="/upload"
          className="bg-blue-600 text-white p-6 rounded shadow flex items-center justify-center text-lg font-semibold hover:bg-blue-700"
        >
          Upload Excel
        </a>

        {/* Search */}
        <a
          href="/search"
          className="bg-green-600 text-white p-6 rounded shadow flex items-center justify-center text-lg font-semibold hover:bg-green-700"
        >
          Search CNIC
        </a>

        {/* Export */}
        <a
          href="/api/export"
          className="bg-purple-600 text-white p-6 rounded shadow flex items-center justify-center text-lg font-semibold hover:bg-purple-700"
        >
          Export Excel
        </a>

      </div>
    </Layout>
  );
}
