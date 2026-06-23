import mongoose from "mongoose";

const localizedString = {
  az: { type: String, default: "" },
  en: { type: String, default: "" },
  ru: { type: String, default: "" },
};

const settingsSchema = new mongoose.Schema(
  {
    hotelName: localizedString,
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: localizedString,
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    googleMapsLink: { type: String, default: "" },
    reception: { type: String, default: "" },
    aquapark: { type: String, default: "" },
    dining: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

delete mongoose.models.Settings;
export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
