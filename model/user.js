import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    supabaseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
