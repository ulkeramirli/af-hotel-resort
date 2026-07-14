const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

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

const roomSchema = new mongoose.Schema({
  name: localizedString,
  description: localizedString,
  capacity: Number,
  price: Number,
  amenities: [localizedStringOptional],
});

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

async function getRooms() {
  const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
  await mongoose.connect(uri);
  
  const rooms = await Room.find().select('_id name capacity price').lean();
  console.log(JSON.stringify(rooms, null, 2));
  
  await mongoose.disconnect();
}

getRooms().catch(console.error);
