import mongoose from "mongoose";

const roomSettingsSchema = new mongoose.Schema(
  {
    tag: { type: String, default: "OTAQLAR & KOTECLƏR" },
    title: { type: String, default: "Rahatlığın Yeni Səviyyəsi" },
    subtitle: { type: String, default: "Hər zövqə uyğun lüks otaqlar" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RoomSettings || mongoose.model("RoomSettings", roomSettingsSchema);
