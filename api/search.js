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
