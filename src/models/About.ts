import mongoose from "mongoose";

const aboutShcema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.models.About || mongoose.model("About", aboutShcema);
