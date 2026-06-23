import mongoose from "mongoose";

const localizedString = {
  az: { type: String, default: "" },
  en: { type: String, default: "" },
  ru: { type: String, default: "" },
};

const aboutShcema = new mongoose.Schema(
  {
    title: localizedString,
    description: localizedString,
    images: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

delete mongoose.models.About;
export default mongoose.models.About || mongoose.model("About", aboutShcema);
