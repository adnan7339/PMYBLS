
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: "admin" }
});
export default mongoose.models.User || mongoose.model("User", UserSchema);
