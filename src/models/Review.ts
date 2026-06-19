import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    emailOrPhone: {
      type: String,
      require: true,
    },
    message: {
      type: String,
      require: true,
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
