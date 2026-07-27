import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  value: { type: mongoose.Schema.Types.Mixed, default: {} },
  label: { type: mongoose.Schema.Types.Mixed, default: {} },
  sub: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const activitySettingsSchema = new mongoose.Schema(
  {
    tag: { type: mongoose.Schema.Types.Mixed, default: {} },
    title: { type: mongoose.Schema.Types.Mixed, default: {} },
    subtitle: { type: mongoose.Schema.Types.Mixed, default: {} },
    stats: [statSchema],
  },
  {
    timestamps: true,
  },
);

delete mongoose.models.ActivitySettings;
export default mongoose.model("ActivitySettings", activitySettingsSchema);
