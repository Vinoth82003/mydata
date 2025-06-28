import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { put } from "@vercel/blob";
import { v4 as uuid } from "uuid";

export async function PATCH(req) {
  try {
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
      image,
      removeImage,
      twoFaEnabled,
    } = await req.json();

    console.log("Incomming: ", fname, lname, image, removeImage, twoFaEnabled);
    

    // ✅ Update name fields
    if (fname) user.fname = fname;
    if (lname) user.lname = lname;
    user.twoFaEnabled = twoFaEnabled;

    // ✅ Remove existing image
    if (image==undefined||removeImage) {
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
