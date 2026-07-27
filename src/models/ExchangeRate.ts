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

delete mongoose.models.ExchangeRate;
export default mongoose.model("ExchangeRate", exchangeRateSchema);
