import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";
import User from "@/models/User"; 

async function getUserId(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");
  const decoded = verifyToken(token, process.env.ACCESS_SECRET);
  if (!decoded?.id) throw new Error("Invalid token");
  return decoded.id;
}

export async function GET(req) {
  try {
    const userId = await getUserId(req);
    await connectDB();
    const events = await Event.find({ userId }).sort({ start: 1 });
    return NextResponse.json({ success: true, data: events });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}


export async function POST(req) {
  try {
    const userId = await getUserId(req);
    await connectDB();

    // ✅ Check if user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return NextResponse.json(
        { success: false, error: "User does not exist" },
        { status: 404 }
      );
    }

    const data = await req.json();
    const event = await Event.create({ ...data, userId });

    await logActivity(userId, "event_added", `Added Event: ${event.title}`, {
      eventId: event._id,
    });

    return NextResponse.json({ success: true, data: event });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}

