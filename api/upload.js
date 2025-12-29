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
import formidable from "formidable";
import XLSX from "xlsx";

export const config = { api:{ bodyParser:false } };

export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  if(req.method!=="POST") return res.status(405).end();
  await connectDB();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files)=>{
    if(err) return res.status(500).json({message:"Upload error"});
    const wb = XLSX.readFile(files.filepath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for(const r of rows){
      await Applicant.create({
        applicant_name: r.applicant_name,
        applicant_cnic: r.applicant_cnic,
        business_sub_sector: r.business_sub_sector,
        mfibankname: r.mfibankname
      });
    }
    res.json({message:"Excel uploaded"});
  });
}
