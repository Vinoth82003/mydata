import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { put } from "@vercel/blob";
import { v4 as uuid } from "uuid";

export async function POST(req) {
  try {
    const { fname, lname, email, password, twoFaEnabled, image } =
      await req.json();

    if (!fname || !lname || !email || !password) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    let imageUrl = null;

    // Upload image if provided as base64 or Blob URL
    if (image?.startsWith("data:image/")) {
      const buffer = Buffer.from(image.split(",")[1], "base64");
      const blob = await put(`profile-${uuid()}.png`, buffer, {
        access: "public",
        contentType: "image/png",
      });
      imageUrl = blob.url;
    } else if (image?.startsWith("https://")) {
      imageUrl = image; // Already uploaded by client
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
      twoFaEnabled,
      image: imageUrl,
    });

    await newUser.save();

    return Response.json({ message: "Signup successful" }, { status: 201 });
  } catch (err) {
    console.error("Signup Error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
