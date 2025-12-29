import connectDB from "../lib/mongodb";
import Applicant from "../models/Applicant";
import formidable from "formidable";
import XLSX from "xlsx";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pmybls.vercel.app");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Upload error" });
      }

      const workbook = XLSX.readFile(files.filepath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      for (const r of rows) {
        await Applicant.create({
          applicant_name: r.applicant_name,
          applicant_cnic: r.applicant_cnic,
          business_sub_sector: r.business_sub_sector,
          mfibankname: r.mfibankname,
        });
      }

      return res.status(200).json({ message: "Excel uploaded successfully" });
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
