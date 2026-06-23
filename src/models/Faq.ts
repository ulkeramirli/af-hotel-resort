import mongoose from "mongoose";

const localizedString = {
  az: { type: String, default: "" },
  en: { type: String, default: "" },
  ru: { type: String, default: "" },
};

const faqSchema = new mongoose.Schema(
  {
    question: localizedString,
    answer: localizedString,
  },
  {
    timestamps: true,
  },
);

delete mongoose.models.Faq;
export default mongoose.models.Faq || mongoose.model("Faq", faqSchema);
