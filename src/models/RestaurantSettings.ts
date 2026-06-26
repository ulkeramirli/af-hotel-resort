import mongoose from "mongoose";

const restaurantSettingsSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.RestaurantSettings ||
  mongoose.model("RestaurantSettings", restaurantSettingsSchema);
