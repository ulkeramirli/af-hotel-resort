import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  value: { type: String, default: "" },
  label: { type: String, default: "" },
  sub: { type: String, default: "" },
});

const activitySettingsSchema = new mongoose.Schema(
  {
    tag: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    stats: [statSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ActivitySettings ||
  mongoose.model("ActivitySettings", activitySettingsSchema);
