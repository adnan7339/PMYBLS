import connectDB from "../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      email: String,
      password: String,
      role: String,
    })
  );

function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pmybls.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  try {
    if (cors(req, res)) return;

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!body || !body.email || !body.password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const { email, password } = body;

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
