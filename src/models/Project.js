import mongoose from "mongoose";

const EnvSchema = new mongoose.Schema({
  key: String,
  value: String,
});

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    repo: String,
    live: String,
    techStack: [String],
    tags: [String],
    env: [EnvSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
