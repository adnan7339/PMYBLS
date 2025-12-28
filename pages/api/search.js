import connectDB from "../../lib/mongodb";
import Applicant from "../../models/Applicant";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { cnic } = req.query;
    if (!cnic) {
      return res.status(400).json({ message: "CNIC is required" });
    }

    const record = await Applicant.findOne({ applicant_cnic: cnic });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
}
