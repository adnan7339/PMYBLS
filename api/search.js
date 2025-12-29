export default async function handler(req, res) {
  // ✅ CORS HEADERS
  res.setHeader("Access-Control-Allow-Origin", "https://pmybls.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
}
import connectDB from "../lib/mongodb";
import Applicant from "../models/Applicant";

export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  await connectDB();
  const { cnic } = req.query;
  const doc = await Applicant.findOne({ applicant_cnic: cnic });
  if(!doc) return res.status(404).json({message:"Not found"});
  res.json(doc);
}
