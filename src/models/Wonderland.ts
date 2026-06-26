import mongoose from "mongoose";

const localizedString = {
  az: { type: String, required: true },
  en: { type: String, required: true },
  ru: { type: String, required: true },
};

const localizedStringOptional = {
  az: { type: String, default: "" },
  en: { type: String, default: "" },
  ru: { type: String, default: "" },
};

const gameShcema = new mongoose.Schema({
  name: localizedString,
  image: {
    type: String,
    required: true,
  },
  description: localizedString,
});

const bigAttractionSchema = new mongoose.Schema({
  title: localizedString,
  games: [gameShcema],
});

const smallAttractionSchema = new mongoose.Schema({
  name: localizedString,
  description: localizedString,
  icon: String,
});

const ticketSchema = new mongoose.Schema({
  name: localizedString,
  price: {
    type: String,
    required: true,
  },
});

const wonderlandSchema = new mongoose.Schema(
  {
    title: localizedString,
    tag: localizedStringOptional,
    workingHours: {
      type: String,
      default: "",
    },
    description: localizedString,
    discount: {
      enabled: {
        type: Boolean,
        default: false,
      },

      percentage: {
        type: Number,
        default: 0,
      },
    },

    tickets: [ticketSchema],
    smallAttractions: [smallAttractionSchema],

    bigAttractions: [bigAttractionSchema],
  },
  {
    timestamps: true,
  },
);

// delete mongoose.models.Wonderland;
export default mongoose.models.Wonderland || mongoose.model("Wonderland", wonderlandSchema);
