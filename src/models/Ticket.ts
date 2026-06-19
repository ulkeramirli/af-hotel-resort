import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
