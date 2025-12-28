import connectDB from "../lib/mongodb";
import Applicant from "../models/Applicant";

export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  await connectDB();
  const total = await Applicant.countDocuments();
  res.json({ total });
}
