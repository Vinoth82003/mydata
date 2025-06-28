import mongoose from "mongoose";

const PasswordEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    username: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String, required: true },
    website: { type: String, trim: true },
    notes: { type: String, trim: true },
    tags: { type: [String], default: [] },
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.PasswordEntry ||
  mongoose.model("PasswordEntry", PasswordEntrySchema);
