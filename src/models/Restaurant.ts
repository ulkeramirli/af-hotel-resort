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

// ─── Menu Item (each dish/product) ───
const menuItemSchema = new mongoose.Schema({
  name: localizedString,
  description: localizedStringOptional,
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
});

// ─── Menu Category (groups menu items) ───
const menuCategorySchema = new mongoose.Schema({
  name: localizedString,
  items: [menuItemSchema],
});

// ─── Working Hours (breakfast, lunch, dinner) ───
const workingHoursSchema = new mongoose.Schema(
  {
    breakfast: {
      type: String,
      default: "",
    },
    lunch: {
      type: String,
      default: "",
    },
    dinner: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

// ─── Restaurant ───
const restaurantSchema = new mongoose.Schema(
  {
    name: localizedString,
    image: {
      type: String,
      default: "",
    },
    description: localizedStringOptional,
    workingHours: {
      type: workingHoursSchema,
      default: () => ({ breakfast: "", lunch: "", dinner: "" }),
    },
    phone: {
      type: String,
      default: "",
    },
    menu: [menuCategorySchema],
  },
  {
    timestamps: true,
  },
);

delete mongoose.models.Restaurant;
export default mongoose.model("Restaurant", restaurantSchema);
