import mongoose from "mongoose";

// ─── Menu Item (each dish/product) ───
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
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
  name: {
    type: String,
    required: true,
  },
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
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
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

export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", restaurantSchema);
