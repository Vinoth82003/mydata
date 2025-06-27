import { connectDB } from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, otp, keepSignedIn } = await req.json();

    if (!email || !otp) {
      return Response.json({ error: "Missing data" }, { status: 400 });
    }

    await connectDB();

    const record = await Otp.findOne({ email, code: otp });

    if (!record || record.expiresAt < new Date()) {
      return Response.json(
        { error: "OTP invalid or expired" },
        { status: 401 }
      );
    }

    await Otp.deleteOne({ _id: record._id });

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { accessToken, refreshToken } = signToken(
      { id: user._id, email },
      keepSignedIn
    );

    // Set refresh token as secure cookie if requested
    if (keepSignedIn && refreshToken) {
      const cookieStore = await cookies();
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return Response.json({ accessToken });
  } catch (error) {
    console.error("OTP Login Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
