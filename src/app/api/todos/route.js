import { connectDB } from "@/lib/db";
import TodoTask from "@/models/TodoTask";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";

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
    const tasks = await TodoTask.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tasks });
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
    const body = await req.json();
    const newTask = await TodoTask.create({ ...body, userId });
    await logActivity(userId, "todo_added", `Added task: ${body.text}`, {
      taskId: newTask._id,
    });

    return NextResponse.json({ success: true, data: newTask });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}

export async function PATCH(req) {
  try {
    const userId = await getUserId(req);
    await connectDB();
    const { id, updates } = await req.json();
    const task = await TodoTask.findById(id);
    if (!task || task.userId.toString() !== userId)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const updated = await TodoTask.findByIdAndUpdate(id, updates, {
      new: true,
    });

    await logActivity(userId, "todo_updated", `Updated task: ${updated.text}`, {
      taskId: updated._id,
      updates,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}

export async function DELETE(req) {
  try {
    const userId = await getUserId(req);
    await connectDB();
    const id = req.nextUrl.searchParams.get("id");
    const task = await TodoTask.findById(id);
    if (!task || task.userId.toString() !== userId)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    await TodoTask.findByIdAndDelete(id);

    await logActivity(userId, "todo_deleted", `Deleted task: ${task.text}`, {
      taskId: task._id,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}
