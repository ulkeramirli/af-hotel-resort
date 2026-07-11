import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load .env relative to the script
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import Settings from "../src/models/Settings";
import RoomSettings from "../src/models/RoomSettings";
import RestaurantSettings from "../src/models/RestaurantSettings";
import ActivitySettings from "../src/models/ActivitySettings";

const MONGO_URI = process.env.DATABASE_URL || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI or DATABASE_URL in .env");
  process.exit(1);
}

const seedSettings = async () => {
  try {
    console.log("Connecting to MongoDB for Settings Seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    // CLEAR OLD SETTINGS
    console.log("Clearing old settings...");
    await Settings.deleteMany({});
    await RoomSettings.deleteMany({});
    await RestaurantSettings.deleteMany({});
    await ActivitySettings.deleteMany({});

    // 1. SETTINGS (General Hotel Settings)
    console.log("Seeding General Settings...");
    await Settings.create({
      hotelName: { az: "AF Hotel & Aqua Park", en: "AF Hotel & Aqua Park", ru: "AF Hotel & Aqua Park" },
      phone: "+994 50 123 45 67",
      email: "info@af-hotel.az",
      address: {
        az: "Sahil küçəsi, Novxanı qəsəbəsi, Bakı, Azərbaycan",
        en: "Sahil street, Novkhani settlement, Baku, Azerbaijan",
        ru: "Улица Сахиль, поселок Новханы, Баку, Азербайджан"
      },
      instagram: "https://instagram.com/afhotelbaku",
      facebook: "https://facebook.com/afhotelbaku",
      tiktok: "https://tiktok.com/@afhotelbaku",
      googleMapsLink: "https://maps.app.goo.gl/afhotel",
      reception: "24/7",
      aquapark: "10:00 - 19:00",
      dining: "08:00 - 23:00"
    });

    // 2. ROOM SETTINGS
    console.log("Seeding Room Settings...");
    await RoomSettings.create({
      tag: "OTAQLAR & KOTECLƏR",
      title: "Rahatlığın Yeni Səviyyəsi",
      subtitle: "Hər zövqə uyğun lüks otaqlar. Xəzər dənizinə açılan möhtəşəm mənzərə və 24/7 premium xidmət."
    });

    // 3. RESTAURANT SETTINGS
    console.log("Seeding Restaurant Settings...");
    await RestaurantSettings.create({
      tag: "QASTRANOMİYA",
      title: "Dadlı Təamlar Dünyası",
      subtitle: "Milli və xarici mətbəxin ən ləziz yeməkləri sizin üçün xüsusi hazırlanır."
    });

    // 4. ACTIVITY SETTINGS
    console.log("Seeding Activity Settings...");
    await ActivitySettings.create({
      tag: "ƏYLƏNCƏ VƏ İSTİRAHƏT",
      title: "Akvapark və SPA Mərkəzi",
      subtitle: "Gününüzü əyləncəli, həm də rahatlaşdırıcı fəaliyyətlərlə unudulmaz edin.",
      stats: [
        { value: "20+", label: "Sürüşkən", sub: "Adrenalin" },
        { value: "4", label: "Hovuz", sub: "Açıq və Qapalı" },
        { value: "100%", label: "Təhlükəsizlik", sub: "Peşəkar nəzarət" }
      ]
    });

    console.log("Settings seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding settings:", error);
    process.exit(1);
  }
};

seedSettings();
