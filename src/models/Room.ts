import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    images: { type: [String], default: [] },
    amenities: [
      {
        type: String,
      },
    ],
    beds: { type: Number, default: 1 },
    baths: { type: Number, default: 1 },
    sqft: { type: Number, default: 350 },
    rulesCheckIn: { type: String, default: "" },
    rulesCheckOut: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
