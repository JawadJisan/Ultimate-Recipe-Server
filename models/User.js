import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  displayName: String,
  photoURL: String,
  email: { type: String, unique: true },
  coin: { type: Number, default: 50 },
});

const User = mongoose.model("User", userSchema);
export default User;
