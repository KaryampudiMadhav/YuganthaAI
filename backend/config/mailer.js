import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Ensure env is loaded even in ESM import order
dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error("❌ EMAIL_USER or EMAIL_PASSWORD missing in environment");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ Email transporter error:", err.message);
  } else {
    console.log("✅ Email transporter ready");
  }
});

export default transporter;
