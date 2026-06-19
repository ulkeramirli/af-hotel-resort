import mongoose from "mongoose";

const aboutShcema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    images: {
      type: [String],
      require: true,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.models.About || mongoose.model("About", aboutShcema);
