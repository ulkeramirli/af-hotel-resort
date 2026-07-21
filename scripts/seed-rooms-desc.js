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
  amenities: [localizedStringOptional],
});

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

async function seed() {
  const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
  await mongoose.connect(uri);
  
  const updates = [
    {
      id: "6a50a62dffa40279b740759a", // Family Apartment
      description: {
        en: "Spacious and thoughtfully designed for your family's comfort. Enjoy separate living areas, modern conveniences, and a welcoming atmosphere that feels like a home away from home.",
        ru: "Просторный номер, продуманный для комфорта вашей семьи. Наслаждайтесь отдельной гостиной зоной, современными удобствами и теплой атмосферой, где вы почувствуете себя как дома.",
        az: "Ailənizin rahatlığı üçün düşünülmüş geniş mənzil. Ayrı yaşayış sahələri, müasir imkanlar və özünüzü evinizdəki kimi hiss edəcəyiniz isti atmosferdən həzz alın."
      }
    },
    {
      id: "6a50a62dffa40279b7407595", // Deluxe Sea View
      description: {
        en: "Wake up to breathtaking ocean views in our beautifully appointed Deluxe room. Experience ultimate relaxation with comfortable bedding, elegant decor, and a private balcony.",
        ru: "Просыпайтесь под захватывающий вид на море в нашем элегантном номере Делюкс. Подарите себе абсолютное расслабление: премиальное постельное белье, стильный декор и собственный балкон.",
        az: "Zərif tərtibatlı Deluks otağımızda nəfəskəsici dəniz mənzərəsi ilə oyanın. Yüksək keyfiyyətli yataq dəsti, zərif dekor və şəxsi balkonla tam rahatlığı kəşf edin."
      }
    },
    {
      id: "6a50a62dffa40279b7407591", // Standard
      description: {
        en: "A smart and comfortable retreat for the modern traveler. Enjoy a restful night's sleep, seamless connectivity, and all the essentials you need for a productive or relaxing stay.",
        ru: "Умное и комфортное пространство для современного путешественника. Отличный сон, быстрый Wi-Fi и все необходимое как для работы, так и для расслабляющего отдыха.",
        az: "Müasir səyahətçilər üçün ağıllı və rahat məkan. Dincəldici yuxu, kəsintisiz Wi-Fi və məhsuldar və ya sakitləşdirici istirahət üçün lazım olan hər şeydən həzz alın."
      }
    },
    {
      id: "6a50a62dffa40279b740759f", // Family Cottage
      description: {
        en: "An exclusive sanctuary offering unparalleled privacy and comfort. Set amidst serene surroundings, this spacious cottage features upscale amenities and personalized touches for an unforgettable escape.",
        ru: "Эксклюзивное убежище, предлагающее беспрецедентную конфиденциальность и комфорт. Расположенный среди безмятежных окрестностей, этот просторный коттедж отличается высококлассными удобствами и индивидуальными штрихами для незабываемого отдыха.",
        az: "Bənzərsiz məxfilik və rahatlıq təklif edən eksklüziv məkan. Sakitliklə əhatə olunmuş bu geniş kottec unudulmaz qaçış üçün yüksək səviyyəli şərait və fərdi toxunuşlara malikdir."
      }
    }
  ];

  const commonAmenities = [
    { en: "High-Speed Wi-Fi", ru: "Быстрый Wi-Fi", az: "Sürətli Wi-Fi" },
    { en: "Flat-Screen TV", ru: "Телевизор с плоским экраном", az: "Yastı ekranlı televizor" },
    { en: "Comfortable Bedding", ru: "Комфортное постельное белье", az: "Rahat yataq dəsti" },
    { en: "Room Service", ru: "Обслуживание номеров", az: "Otaq xidməti" }
  ];

  for (const update of updates) {
    await Room.findByIdAndUpdate(update.id, {
      description: update.description,
      amenities: commonAmenities
    });
    console.log(`Updated room ${update.id}`);
  }
  
  await mongoose.disconnect();
}

seed().catch(console.error);
