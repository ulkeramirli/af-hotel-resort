import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["standard", "deluxe", "cottage"],
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    amenities: [
      {
        type: String,
      },
    ],
    isAvailable: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
