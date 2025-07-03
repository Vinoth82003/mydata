// models/Project.js

import mongoose from "mongoose";

const EnvItemSchema = new mongoose.Schema({
  key: String,
  value: String,
});

const EnvGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  variables: [EnvItemSchema],
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
    envGroups: [EnvGroupSchema],
  },
  { timestamps: true }
);

ProjectSchema.pre("save", async function (next) {
  const userExists = await mongoose.models.User.exists({ _id: this.userId });
  if (!userExists) {
    const err = new Error(
      "Cannot save project: referenced user does not exist."
    );
    return next(err);
  }
  next();
});



export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
