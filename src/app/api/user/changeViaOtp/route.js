import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
  try {
    const { type, newEmail, newPassword, otp } = await req.json();

    if (!type || !otp) {
      return Response.json({ error: "Missing type or OTP" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token, process.env.ACCESS_SECRET);
    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    let targetEmail = type === "changeEmail" ? newEmail : user.email;
    if (!targetEmail)
      return Response.json({ error: "Email required" }, { status: 400 });

    const otpRecord = await Otp.findOne({ email: targetEmail });
    if (!otpRecord || !otpRecord.code || !otpRecord.expiresAt) {
      return Response.json({ error: "OTP not found" }, { status: 404 });
    }

    const isExpired = new Date(otpRecord.expiresAt) < new Date();
    if (isExpired) {
      return Response.json({ error: "OTP expired" }, { status: 410 });
    }

    if (otpRecord.code !== otp) {
      return Response.json({ error: "Incorrect OTP" }, { status: 401 });
    }

    // ✅ OTP Verified — Apply changes
    if (type === "changeEmail") {
      if (!newEmail)
        return Response.json({ error: "New email missing" }, { status: 400 });

      user.email = newEmail;
    } else if (type === "changePassword") {
      if (!newPassword)
        return Response.json(
          { error: "New password missing" },
          { status: 400 }
        );

      user.password = await bcrypt.hash(newPassword, 10);
    } else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    // Save changes
    await user.save();

    // Invalidate OTP
    otpRecord.code = "";
    otpRecord.expiresAt = "";
    await otpRecord.save();

    return Response.json({
      message: `${
        type === "changeEmail" ? "Email" : "Password"
      } updated successfully`,
    });
  } catch (err) {
    console.error("OTP update error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
