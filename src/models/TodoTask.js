import mongoose from "mongoose";

const TodoTaskSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TodoTask ||
  mongoose.model("TodoTask", TodoTaskSchema);
