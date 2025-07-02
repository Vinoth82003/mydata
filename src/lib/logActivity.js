import Activity from "@/models/Activity";
import { connectDB } from "./db";

export async function logActivity(userId, type, detail, meta = {}) {
  await connectDB();
  await Activity.create({
    userId,
    type,
    detail,
    meta,
  });
}
