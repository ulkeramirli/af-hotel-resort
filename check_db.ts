import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const uri = process.env.DATABASE_URL || "";

async function run() {
  await mongoose.connect(uri);
  const Restaurant = mongoose.models.Restaurant || mongoose.model("Restaurant", new mongoose.Schema({}, { strict: false }));
  const rests = await Restaurant.find({});
  console.log("Total restaurants:", rests.length);
  rests.forEach(r => {
    console.log("ID:", r._id, "Name:", r.name, "Menu categories:", r.menu?.length);
    if (r.menu?.length > 0) {
      console.log("First category:", r.menu[0].name, "Items:", r.menu[0].items?.length);
    }
  });
  process.exit(0);
}
run();
