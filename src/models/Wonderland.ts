import mongoose from "mongoose";

const gameShcema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
const bigAttractionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  games: [gameShcema],
});

const smallAttractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  icon: String,
});

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },
});
const wonderlandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    workingHours: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },
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

export default mongoose.models.Wonderland ||
  mongoose.model("Wonderland", wonderlandSchema);
