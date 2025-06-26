import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Otp from "@/models/Otp";
import { transporter } from "@/lib/mail";
import { signToken } from "@/lib/auth";
import { MFA } from "@/templates/EmailTemplates";

export async function POST(req) {
  const { email, password, keepSignedIn } = await req.json();
  if (!email || !password)
    return Response.json({ error: "Missing credentials" }, { status: 400 });

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

  // If 2FA enabled, generate OTP and send email
  console.log("is 2FA enabled " + user.twoFaEnabled);
  
  if (user.twoFaEnabled) {
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.findOneAndUpdate(
      { email },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    const mail = MFA(user.fname, code);
    await transporter.sendMail({
      to: email,
      subject: mail.subject,
      html: mail.html,
    });

    return Response.json({ requiresOtp: true });
  }

  // Otherwise, issue JWT immediately
  const token = signToken({ id: user._id, email }, keepSignedIn);
  return Response.json({ token });
}
