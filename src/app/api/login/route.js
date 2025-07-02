import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Otp from "@/models/Otp";
import { transporter } from "@/lib/mail";
import { signToken } from "@/lib/auth";
import { getMailTemplate } from "@/lib/emailTemplates";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, password, keepSignedIn } = await req.json();


    if (!email || !password) {
      return Response.json({ error: "Missing credentials" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2FA handling
    if (user.twoFaEnabled) {
      const code = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      console.log("Generated OTP:", code);
      console.log("Current Time:", new Date().toISOString());
      console.log("OTP Expires At:", expiresAt.toISOString());

      await Otp.findOneAndUpdate(
        { email },
        { code, expiresAt },
        { upsert: true, new: true }
      );

      const mail = getMailTemplate("mfa", code, user.fname || user.email);
      await transporter.sendMail({
        to: email,
        subject: mail.subject,
        html: mail.html,
      });

      return Response.json({ requiresOtp: true });
    }

    // No 2FA → issue tokens
    const { accessToken, refreshToken } = signToken(
      { id: user._id, email: user.email },
      keepSignedIn
    );

    // Await the async cookies() getter
    if (keepSignedIn && refreshToken) {
      const cookieStore = await cookies();
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return Response.json({ accessToken });
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
