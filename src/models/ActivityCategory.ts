import mongoose from "mongoose";

const activityCategorySchema = new mongoose.Schema(
  {
    name: {
      az: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    description: {
      az: { type: String, default: "" },
      en: { type: String, default: "" },
      ru: { type: String, default: "" },
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

// delete mongoose.models.ActivityCategory;
export default mongoose.models.ActivityCategory || mongoose.model("ActivityCategory", activityCategorySchema);
