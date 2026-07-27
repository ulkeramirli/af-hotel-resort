import mongoose from "mongoose";

const restaurantSettingsSchema = new mongoose.Schema(
  {
    tag: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    title: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    subtitle: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

delete mongoose.models.RestaurantSettings;
export default mongoose.model("RestaurantSettings", restaurantSettingsSchema);
