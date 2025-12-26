
import mongoose from "mongoose";
const ApplicantSchema = new mongoose.Schema({
  applicant_cnic: { type: String, unique: true },
  applicant_name: String,
  industry_category: String,
  business_sub_sector: String,
  mfibankname: String
}, { timestamps: true });
export default mongoose.models.Applicant || mongoose.model("Applicant", ApplicantSchema);
