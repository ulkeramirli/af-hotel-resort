import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.RoomType ||
  mongoose.model("RoomType", roomTypeSchema);
