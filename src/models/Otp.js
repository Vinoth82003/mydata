import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String,},
  expiresAt: { type: Date, },
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
