import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";
import User from "@/models/User";

// 🔐 Auth check
async function getUserId(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");
  const decoded = verifyToken(token, process.env.ACCESS_SECRET);
  if (!decoded?.id) throw new Error("Invalid token");
  return decoded.id;
}

// 🟠 PUT Update Event
export async function PUT(req, { params }) {
  try {
    const userId = await getUserId(req);
    const p_id = params.id;
    if (!p_id)
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );

    await connectDB();

    // ✅ Ensure user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }

    const updates = await req.json();
    const event = await Event.findById(p_id);
    if (!event || event.userId.toString() !== userId)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const updated = await Event.findByIdAndUpdate(p_id, updates, {
      new: true,
    });

    await logActivity(
      userId,
      "event_updated",
      `Updated Event: ${updated.title}`,
      { eventId: updated._id }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}


// 🔴 DELETE Event
export async function DELETE(req, { params }) {
  try {
    const userId = await getUserId(req);
    const p_id = params.id;

    await connectDB();

    // ✅ Ensure user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }

    const event = await Event.findById(p_id);
    if (!event || event.userId.toString() !== userId)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    await Event.findByIdAndDelete(p_id);

    await logActivity(
      userId,
      "event_deleted",
      `Deleted Event: ${event.title}`,
      { eventId: event._id }
    );

    return NextResponse.json({ success: true, message: "Event deleted" });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}

