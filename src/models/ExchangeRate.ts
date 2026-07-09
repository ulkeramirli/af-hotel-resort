import mongoose from "mongoose";

const exchangeRateSchema = new mongoose.Schema(
  {
    usd: { type: Number, default: 1.7000 },
    eur: { type: Number, default: 1.8500 },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ExchangeRate || mongoose.model("ExchangeRate", exchangeRateSchema);
