import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    tiktok: {
      type: String,
      default: "",
    },

    googleMapsLink: {
      type: String,
      default: "",
    },

    reception: {
      type: String,
      default: "",
    },

    aquapark: {
      type: String,
      default: "",
    },

    dining: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema);
