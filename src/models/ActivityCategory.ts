import mongoose from "mongoose";

const activityCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    emoji: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ActivityCategory ||
  mongoose.model("ActivityCategory", activityCategorySchema);
