import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  keepSignedIn: { type: Boolean, default: false },
  image: String,
  twoFaEnabled: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
