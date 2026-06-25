import mongoose from "mongoose";

const localizedString = {
  az: { type: String, required: true },
  en: { type: String, required: true },
  ru: { type: String, required: true },
};

const localizedStringOptional = {
  az: { type: String, default: "" },
  en: { type: String, default: "" },
  ru: { type: String, default: "" },
};

const roomSchema = new mongoose.Schema(
  {
    name: localizedString,
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    description: localizedString,
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    images: { type: [String], default: [] },
    amenities: [localizedStringOptional],
    beds: { type: Number, default: 1 },
    baths: { type: Number, default: 1 },
    sqft: { type: Number, default: 350 },
    rulesCheckIn: localizedStringOptional,
    rulesCheckOut: localizedStringOptional,
    isAvailable: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

// delete mongoose.models.Room;
export default mongoose.model("Room", roomSchema);
