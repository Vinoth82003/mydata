import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/logActivity";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return Response.json(
        { error: "Missing email or new password" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return Response.json(
        { error: "New password must be different from the old password" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await Otp.deleteOne({ email });
    await logActivity(user._id, "password", "Changed password");

    return Response.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("OTP update error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
