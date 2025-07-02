import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: { type: String, required: true }, // e.g., 'project_update', 'todo_add', 'password_change'
    detail: { type: String }, // human-readable message
    meta: { type: Object }, // optional context (projectId, todoId etc.)
  },
  { timestamps: true }
);

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);
