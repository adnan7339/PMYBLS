import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/upload"
          className="bg-blue-600 text-white p-6 rounded text-center text-lg font-semibold hover:bg-blue-700"
        >
          Upload Excel
        </a>

        <a
          href="/search"
          className="bg-green-600 text-white p-6 rounded text-center text-lg font-semibold hover:bg-green-700"
        >
          Search CNIC
        </a>

        <a
          href="/api/export"
          className="bg-purple-600 text-white p-6 rounded text-center text-lg font-semibold hover:bg-purple-700"
        >
          Export Excel
        </a>
      </div>
    </Layout>
  );
}
