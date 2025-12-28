import mongoose from "mongoose";

const ApplicantSchema = new mongoose.Schema({
  applicant_name: String,
  applicant_cnic: String,
  business_sub_sector: String,
  mfibankname: String
});

export default mongoose.models.Applicant ||
  mongoose.model("Applicant", ApplicantSchema);
