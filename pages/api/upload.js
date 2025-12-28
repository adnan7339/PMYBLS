import connectDB from "../../lib/mongodb";
import Applicant from "../../models/Applicant";
import XLSX from "xlsx";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const buffer = Buffer.concat(buffers);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

    // Map Excel columns to DB fields
    const data = rows.map((row) => ({
      applicant_cnic: row["Applicant CNIC"],
      applicant_name: row["Applicant Name"],
      industry_category: row["Industry Category"],
      business_sub_sector: row["Business Sub Sector"],
      mfibankname: row["MFIBankName"],
    }));

    await Applicant.insertMany(data, { ordered: false });

    res.status(200).json({
      message: `Excel uploaded successfully (${data.length} records processed)`,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
}
