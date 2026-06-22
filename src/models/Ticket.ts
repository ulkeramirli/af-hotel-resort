import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
