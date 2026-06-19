import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      enum: ["kids", "family", "extreme"],
      require: true,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.models.Activity ||
  mongoose.model("Activity", activitySchema);
