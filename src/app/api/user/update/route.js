import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { put } from "@vercel/blob";
import { v4 as uuid } from "uuid";

export async function PATCH(req) {
  try {
    const cookieStore = cookies();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token, process.env.ACCESS_SECRET);
    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    const {
      fname,
      lname,
      newEmail,
      otpForEmail,
      newPassword,
      otpForPassword,
      image, // base64 or URL
      removeImage,
    } = await req.json();

    // ✅ Update name fields
    if (fname) user.fname = fname;
    if (lname) user.lname = lname;

    // ✅ Update email with OTP verification
    if (newEmail) {
      const storedOtp = cookieStore.get("otp_email_verify")?.value;
      if (!storedOtp || storedOtp !== otpForEmail) {
        return Response.json(
          { error: "Invalid OTP for email" },
          { status: 403 }
        );
      }
      user.email = newEmail;
      cookieStore.set("otp_email_verify", "", {
        path: "/",
        expires: new Date(0),
      });
    }

    // ✅ Update password with OTP
    if (newPassword) {
      const storedOtp = cookieStore.get("otp_password_verify")?.value;
      if (!storedOtp || storedOtp !== otpForPassword) {
        return Response.json(
          { error: "Invalid OTP for password" },
          { status: 403 }
        );
      }
      user.password = await bcrypt.hash(newPassword, 10);
      cookieStore.set("otp_password_verify", "", {
        path: "/",
        expires: new Date(0),
      });
    }

    // ✅ Remove existing image
    if (removeImage) {
      user.image = null;
    }

    // ✅ Upload new image from base64
    if (image?.startsWith("data:image/")) {
      const buffer = Buffer.from(image.split(",")[1], "base64");
      const blob = await put(`profile-${uuid()}.png`, buffer, {
        access: "public",
        contentType: "image/png",
      });
      user.image = blob.url;
    } else if (image?.startsWith("https://")) {
      user.image = image;
    }

    await user.save();

    return Response.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
