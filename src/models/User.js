import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  keepSignedIn: Boolean,
  image: String, 
  twoFaEnabled: Boolean,
});

export default mongoose.models.User || mongoose.model("User", userSchema);
