import connectDB from "../lib/mongodb";
import Applicant from "../models/Applicant";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pmybls.vercel.app");

  try {
    await connectDB();
    const total = await Applicant.countDocuments();
    return res.status(200).json({ total });
  } catch (err) {
    console.error("STATS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
