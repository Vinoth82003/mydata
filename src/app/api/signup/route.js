import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { put } from "@vercel/blob";
import { v4 as uuid } from "uuid";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { fname, lname, email, password, twoFaEnabled, image, keepSignedIn } =
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

    if (image?.startsWith("data:image/")) {
      const buffer = Buffer.from(image.split(",")[1], "base64");
      const blob = await put(`profile-${uuid()}.png`, buffer, {
        access: "public",
        contentType: "image/png",
      });
      imageUrl = blob.url;
    } else if (image?.startsWith("https://")) {
      imageUrl = image;
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

    const { accessToken, refreshToken } = signToken(
      { id: newUser._id, email: newUser.email },
      keepSignedIn
    );

    // If user wants to stay signed in, store refresh token in secure cookie
    if (keepSignedIn && refreshToken) {
      const cookieStore = cookies();
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return Response.json({ accessToken }, { status: 201 });
  } catch (err) {
    console.error("Signup Error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
