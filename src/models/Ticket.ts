import mongoose from "mongoose";

const localizedString = {
  az: { type: String, default: "" },
  en: { type: String, default: "" },
  ru: { type: String, default: "" },
};

const ticketSchema = new mongoose.Schema(
  {
    name: localizedString,
    price: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// delete mongoose.models.Ticket;
export default mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
