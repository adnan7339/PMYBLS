function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pmybls.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}
import connectDB from "../lib/mongodb";
import Applicant from "../models/Applicant";

export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  await connectDB();
  const total = await Applicant.countDocuments();
  res.json({ total });
}
