import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import TodoTask from "@/models/TodoTask";
import Project from "@/models/Project";
import PasswordEntry from "@/models/PasswordEntry";
import Event from "@/models/Event";
import Activity from "@/models/Activity";

// 🔐 Extract userId
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

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    // 1. Todos due today (created today, not completed)
    const todosToday = await TodoTask.find({
      userId,
      completed: false,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    // 2. Upcoming events
    const upcomingEvents = await Event.find({
      userId,
      start: { $gte: new Date() },
    })
      .sort({ start: 1 })
      .limit(1);

    // 3. Passwords expiring soon (e.g., edited > 90 days ago)
    const passwordExpiringSoon = await PasswordEntry.find({
      userId,
      updatedAt: { $lte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    }).limit(1);

    // 4. Projects with env counts
    const projects = await Project.find({ userId });

    const projectEnvSummary = projects.map((p) => ({
      title: p.title,
      envCount: p.envGroups?.reduce(
        (acc, group) => acc + group.variables.length,
        0
      ),
    }));

    const recentActivity = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        todosToday: todosToday.length,
        upcomingEvent: upcomingEvents[0] || null,
        passwordExpiring: passwordExpiringSoon.length > 0,
        projectSummary: projectEnvSummary,
        recentActivity,
      },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
