import { transporter } from "@/lib/mail";
import Otp from "@/models/Otp";
import { connectDB } from "@/lib/db";
import { getMailTemplate } from "@/lib/emailTemplates";

export async function POST(req) {
  try {
    await connectDB();
    const { email, type, name } = await req.json();

    if (!email || !type)
      return Response.json(
        { error: "Email and type required" },
        { status: 400 }
      );

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    const mailOptions = getMailTemplate(type, code, name);

    if (!mailOptions) {
      return Response.json({ error: "Invalid email type" }, { status: 400 });
    }

    mailOptions.from = `"MyData Security Team" <${process.env.EMAIL_USER}>`;
    mailOptions.to = email;

    await transporter.sendMail(mailOptions);

    return Response.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
