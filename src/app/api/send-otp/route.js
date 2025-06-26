import { transporter } from "@/lib/mail";
import Otp from "@/models/Otp";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();
    if (!email)
      return Response.json({ error: "Email required" }, { status: 400 });

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Save to DB
    await Otp.findOneAndUpdate(
      { email },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    // Send Email
    const mailOptions = {
      from: `"MyData Security Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your OTP for MyData Verification",
      html: `
        <div style="font-family: sans-serif; color: #111;">
          <h2>Verify Your Email</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="letter-spacing: 4px; font-size: 2rem;">${code}</h1>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr />
          <p style="font-size: 0.9rem;">MyData Security | Chennai</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
