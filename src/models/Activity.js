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

// ✅ Pre-save hook to check if user exists
ActivitySchema.pre("save", async function (next) {
  const userExists = await mongoose.models.User.exists({ _id: this.userId });
  if (!userExists) {
    return next(
      new Error("Cannot save activity: referenced user does not exist.")
    );
  }
  next();
});

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);
