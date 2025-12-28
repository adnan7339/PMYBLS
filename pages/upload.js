import { useState } from "react";
import Layout from "../components/Layout";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const upload = async () => {
    if (!file) {
      alert("Please select Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMsg(data.message || "Uploaded");
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Upload Excel File</h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <br />

      <button
        onClick={upload}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Upload
      </button>

      {msg && <p className="mt-4">{msg}</p>}
    </Layout>
  );
}
