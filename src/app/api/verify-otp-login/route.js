import { connectDB } from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  const { email, otp, keepSignedIn } = await req.json();
  if (!email || !otp)
    return Response.json({ error: "Missing data" }, { status: 400 });

  await connectDB();
  const record = await Otp.findOne({ email, code: otp });
  if (!record || record.expiresAt < new Date()) {
    return Response.json({ error: "OTP invalid or expired" }, { status: 401 });
  }

  await Otp.deleteOne({ _id: record._id });
  const user = await User.findOne({ email });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const token = signToken({ id: user._id, email }, keepSignedIn);
  return Response.json({ token });
}
