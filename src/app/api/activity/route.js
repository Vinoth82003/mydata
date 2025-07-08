import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Activity from "@/models/Activity";

async function getUserId(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");
  const decoded = verifyToken(token, process.env.ACCESS_SECRET);
  if (!decoded?.id) throw new Error("Invalid token");
  return decoded.id;
}

export async function GET(req) {
  try {
    await connectDB();
    const userId = await getUserId(req);

    const activity = await Activity.find({ userId })
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: activity,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message });
  }
}