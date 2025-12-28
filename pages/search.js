import { useState } from "react";
import Layout from "../components/Layout";

export default function Search() {
  const [cnic, setCnic] = useState("");
  const [result, setResult] = useState(null);

  const search = async () => {
    if (!cnic) return;

    const res = await fetch(`/api/search?cnic=${cnic}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Search by CNIC</h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Enter CNIC"
        value={cnic}
        onChange={(e) => setCnic(e.target.value)}
      />

      <button
        onClick={search}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Search
      </button>

      {result && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <p><b>Name:</b> {result.applicant_name}</p>
          <p><b>CNIC:</b> {result.applicant_cnic}</p>
          <p><b>Category:</b> {result.industry_category}</p>
          <p><b>Business:</b> {result.business_sub_sector}</p>
          <p><b>Bank:</b> {result.mfibankname}</p>
        </div>
      )}
    </Layout>
  );
}
