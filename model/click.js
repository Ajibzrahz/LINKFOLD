//one recorded click event
import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
  {
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
    },
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      required: true,
    },
    referrer: {
      type: String,
      default: "",
    },
    visitorId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true },
);

const Click = mongoose.model("Click", clickSchema);
export default Click;
