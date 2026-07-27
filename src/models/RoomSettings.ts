import mongoose from "mongoose";

const roomSettingsSchema = new mongoose.Schema(
  {
    tag: { type: mongoose.Schema.Types.Mixed, default: {} },
    title: { type: mongoose.Schema.Types.Mixed, default: {} },
    subtitle: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

delete mongoose.models.RoomSettings;
export default mongoose.model("RoomSettings", roomSettingsSchema);
