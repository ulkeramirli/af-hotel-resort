import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      az: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// delete mongoose.models.RoomType;
export default mongoose.models.RoomType || mongoose.model("RoomType", roomTypeSchema);
