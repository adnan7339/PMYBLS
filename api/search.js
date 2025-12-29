import connectDB from "../lib/mongodb";
import Applicant from "../models/Applicant";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pmybls.vercel.app");

  try {
    await connectDB();

    const { cnic } = req.query;
    if (!cnic) {
      return res.status(400).json({ message: "CNIC required" });
    }

    const record = await Applicant.findOne({ applicant_cnic: cnic });
    if (!record) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(record);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
