import mongoose from "mongoose";

//a user's link-in-bio page
const pageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      index: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);


const Page = mongoose.model("Page", pageSchema)
export default Page