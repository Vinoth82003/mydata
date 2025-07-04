import { connectDB } from "@/lib/db";
import Otp from "@/models/Otp";

export async function POST(req) {
  const { email, otp } = await req.json();
  await connectDB();

  if (!email || !otp) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await Otp.findOne({ email });

  if (!user || !user.code || !user.expiresAt) {
    return Response.json({ error: "OTP not found" }, { status: 404 });
  }

  const isExpired = new Date(user.expiresAt) < new Date();
  if (isExpired) {
    return Response.json({ error: "OTP expired" }, { status: 410 });
  }

  if (user.code !== otp) {
    return Response.json({ error: "Incorrect OTP" }, { status: 401 });
  }

  user.code = "";
  user.expiresAt = "";
  user.isVerified = true; 
  await user.save();

  return Response.json({ success: true });
}
