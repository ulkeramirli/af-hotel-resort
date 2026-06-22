import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    emailOrPhone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    adminReply: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
