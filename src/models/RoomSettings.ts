import mongoose from "mongoose";

const roomSettingsSchema = new mongoose.Schema(
  {
    tag: { type: String, default: "OTAQLAR & KOTECLƏR" },
    title: { type: String, default: "Mükəmməl İstirahət Məkanı" },
    subtitle: { type: String, default: "Hər zövqə uyğun rahat otaqlar" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RoomSettings || mongoose.model("RoomSettings", roomSettingsSchema);
