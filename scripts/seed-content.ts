import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load .env relative to the script
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Models
import RoomType from "../src/models/RoomType";
import Room from "../src/models/Room";
import Restaurant from "../src/models/Restaurant";
import ActivityCategory from "../src/models/ActivityCategory";
import Activity from "../src/models/Activity";
import Wonderland from "../src/models/Wonderland";

const MONGO_URI = process.env.DATABASE_URL || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI or DATABASE_URL in .env");
  process.exit(1);
}

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    // CLEAR DB
    console.log("Clearing old data...");
    await RoomType.deleteMany({});
    await Room.deleteMany({});
    await Restaurant.deleteMany({});
    await ActivityCategory.deleteMany({});
    await Activity.deleteMany({});
    await Wonderland.deleteMany({});

    // 1. ROOM TYPES
    console.log("Seeding Room Types...");
    const typeStandard = await RoomType.create({
      name: { az: "Standart", en: "Standard", ru: "Стандарт" },
    });
    const typeDeluxe = await RoomType.create({
      name: { az: "Deluks", en: "Deluxe", ru: "Делюкс" },
    });
    const typeApt = await RoomType.create({
      name: { az: "Apartament", en: "Apartment", ru: "Апартаменты" },
    });
    const typeCottage = await RoomType.create({
      name: { az: "Kottec", en: "Cottage", ru: "Коттедж" },
    });

    // 2. ROOMS
    console.log("Seeding Rooms...");
    await Room.create([
      {
        name: { az: "Standart Tək/Cüt Otaq", en: "Standard Single/Double Room", ru: "Стандартный Одноместный/Двухместный Номер" },
        type: typeStandard._id,
        description: {
          az: "Gözəl dəniz və ya hovuz mənzərəsi, komfortlu mebellər, düz ekran TV, mini-bar və pulsuz Wi-Fi ilə təchiz olunmuş geniş və işıqlı otaq.",
          en: "A spacious and bright room equipped with beautiful sea or pool views, comfortable furnishings, flat-screen TV, minibar, and free Wi-Fi.",
          ru: "Просторный и светлый номер с красивым видом на море или бассейн, удобной мебелью, телевизором с плоским экраном, мини-баром и бесплатным Wi-Fi."
        },
        price: 80,
        priceUsd: 47,
        priceEur: 44,
        capacity: 2,
        images: ["/AF-hotel.jpg"],
        amenities: [
          { az: "Kondisioner", en: "Air Conditioning", ru: "Кондиционер" },
          { az: "Mini-bar", en: "Mini-bar", ru: "Мини-бар" },
          { az: "Wi-Fi", en: "Wi-Fi", ru: "Wi-Fi" }
        ],
        beds: 1,
        baths: 1,
        sqft: 28,
        isAvailable: true
      },
      {
        name: { az: "Deluks Dəniz Mənzərəli", en: "Deluxe Sea View Room", ru: "Делюкс с Видом на Море" },
        type: typeDeluxe._id,
        description: {
          az: "Balkonlu, Xəzər dənizinə açılan möhtəşəm panoram mənzərəli, xüsusi dizaynlı rahat otaq. Romantik istirahət və xüsusi günlər üçün ideal seçimdir.",
          en: "A uniquely designed beautiful room with a balcony offering a magnificent panoramic view of the Caspian Sea. Ideal for romantic getaways and special occasions.",
          ru: "Уникальный и красивый номер с балконом, предлагающий великолепный панорамный вид на Каспийское море. Идеально подходит для романтического отдыха и особых случаев."
        },
        price: 140,
        priceUsd: 82,
        priceEur: 77,
        capacity: 3,
        images: ["/AF-hotel.jpg"],
        amenities: [
          { az: "Kondisioner", en: "Air Conditioning", ru: "Кондиционер" },
          { az: "Mini-bar", en: "Mini-bar", ru: "Мини-бар" },
          { az: "Wi-Fi", en: "Wi-Fi", ru: "Wi-Fi" },
          { az: "Dəniz Mənzərəsi", en: "Sea View", ru: "Вид на Море" }
        ],
        beds: 2,
        baths: 1,
        sqft: 42,
        isAvailable: true
      },
      {
        name: { az: "Ailəvi Apartament", en: "Family Apartment", ru: "Семейные Апартаменты" },
        type: typeApt._id,
        description: {
          az: "Ailənizlə birlikdə rahat və geniş məkanda dincəlmək üçün tam təchiz olunmuş apartament. Mətbəx, geniş qonaq otağı və yataq otaqlarından ibarətdir.",
          en: "A fully equipped apartment to relax in a comfortable and spacious environment with your family. Includes a kitchen, spacious living room, and bedrooms.",
          ru: "Полностью оборудованные апартаменты для комфортного и просторного отдыха с семьей. Включает кухню, просторную гостиную и спальни."
        },
        price: 220,
        priceUsd: 129,
        priceEur: 120,
        capacity: 4,
        images: ["/AF-hotel.jpg"],
        amenities: [
          { az: "Mətbəx", en: "Kitchen", ru: "Кухня" },
          { az: "Kondisioner", en: "Air Conditioning", ru: "Кондиционер" },
          { az: "Mini-bar", en: "Mini-bar", ru: "Мини-бар" },
          { az: "Wi-Fi", en: "Wi-Fi", ru: "Wi-Fi" }
        ],
        beds: 3,
        baths: 2,
        sqft: 65,
        isAvailable: true
      },
      {
        name: { az: "Ailəvi Kottec", en: "Family Cottage", ru: "Семейный Коттедж" },
        type: typeCottage._id,
        description: {
          az: "Təbiətlə iç-içə, dəniz kənarında tam fərdi və VIP səviyyəli istirahət üçün kotteclərimiz sizə özəl bağçası və geniş interyeri ilə fərqlənir.",
          en: "In harmony with nature, our cottages by the sea distinguish themselves with a private garden and spacious interior for completely personal and VIP-level relaxation.",
          ru: "В гармонии с природой наши коттеджи у моря отличаются собственным садом и просторным интерьером для полностью индивидуального и VIP отдыха."
        },
        price: 280,
        priceUsd: 165,
        priceEur: 155,
        capacity: 6,
        images: ["/AF-hotel.jpg"],
        amenities: [
          { az: "Özəl Bağça", en: "Private Garden", ru: "Собственный Сад" },
          { az: "Mətbəx", en: "Kitchen", ru: "Кухня" },
          { az: "Kondisioner", en: "Air Conditioning", ru: "Кондиционер" },
          { az: "Wi-Fi", en: "Wi-Fi", ru: "Wi-Fi" }
        ],
        beds: 4,
        baths: 2,
        sqft: 80,
        isAvailable: true
      }
    ]);

    // 3. RESTAURANTS
    console.log("Seeding Restaurants...");
    await Restaurant.create([
      {
        name: { az: "Xəzər Restoranı", en: "Caspian Restaurant", ru: "Ресторан Каспий" },
        image: "/AF-hotel.jpg",
        description: {
          az: "Milli Azərbaycan və Avropa mətbəxinin ən ləziz təamları Xəzər dənizinə açılan möhtəşəm mənzərə ilə.",
          en: "The most delicious dishes of national Azerbaijani and European cuisines with a magnificent view of the Caspian Sea.",
          ru: "Самые вкусные блюда национальной азербайджанской и европейской кухонь с великолепным видом на Каспийское море."
        },
        workingHours: { breakfast: "08:00 - 11:00", lunch: "13:00 - 16:00", dinner: "19:00 - 23:00" },
        phone: "+994 50 123 45 67",
        menu: [
          {
            name: { az: "Səhər Yeməyi", en: "Breakfast", ru: "Завтрак" },
            items: [
              {
                name: { az: "Açıq Bufet", en: "Open Buffet", ru: "Шведский Стол" },
                description: { az: "Zəngin səhər yeməyi növü", en: "Rich variety of breakfast options", ru: "Богатый выбор завтрака" },
                price: 25,
                image: "/AF-hotel.jpg"
              }
            ]
          }
        ]
      },
      {
        name: { az: "Aqua Bar & Lounge", en: "Aqua Bar & Lounge", ru: "Аква Бар и Лаунж" },
        image: "/AF-aqua.jpg",
        description: {
          az: "Hovuz kənarında sərinləşdirici kokteyllər, isti qəlyanaltılar və rahatlaşdırıcı musiqi sədaları altında istirahət.",
          en: "Relaxing poolside with refreshing cocktails, warm snacks, and soothing music sounds.",
          ru: "Отдых у бассейна с освежающими коктейлями, горячими закусками и звуками расслабляющей музыки."
        },
        workingHours: { breakfast: "", lunch: "11:00 - 18:00", dinner: "18:00 - 02:00" },
        phone: "+994 50 123 45 68",
        menu: []
      }
    ]);

    // 4. ACTIVITY CATEGORIES & ACTIVITIES
    console.log("Seeding Activities...");
    const catAqua = await ActivityCategory.create({
      name: { az: "Akvapark", en: "Aqua Park", ru: "Аквапарк" },
      emoji: "🌊"
    });
    const catSpa = await ActivityCategory.create({
      name: { az: "SPA & Fitnes", en: "SPA & Fitness", ru: "СПА и Фитнес" },
      emoji: "🧘‍♀️"
    });

    await Activity.create([
      {
        title: { az: "Ekstremal Su Sürüşkənləri", en: "Extreme Water Slides", ru: "Экстремальные Водные Горки" },
        description: { az: "Adrenalin sevənlər üçün xüsusi olaraq dizayn edilmiş 20-dən çox su sürüşkəni.", en: "More than 20 water slides specifically designed for adrenaline lovers.", ru: "Более 20 водных горок, специально разработанных для любителей адреналина." },
        image: "/AF-aqua.jpg",
        category: catAqua._id
      },
      {
        title: { az: "Uşaq Su Dünyası", en: "Kids Water World", ru: "Детский Водный Мир" },
        description: { az: "Uşaqlar üçün təhlükəsiz və əyləncəli kiçik hovuzlar, su fəvvarələri.", en: "Safe and fun small pools and water fountains for children.", ru: "Безопасные и веселые небольшие бассейны и водные фонтаны для детей." },
        image: "/AF-aqua.jpg",
        category: catAqua._id
      },
      {
        title: { az: "Türk Hamamı", en: "Turkish Bath", ru: "Турецкая Баня" },
        description: { az: "Bədəninizi və ruhunuzu dincəltmək üçün ənənəvi türk hamamı xidmətləri.", en: "Traditional Turkish bath services to relax your body and soul.", ru: "Традиционные услуги турецкой бани для расслабления тела и души." },
        image: "/AF-hotel.jpg",
        category: catSpa._id
      }
    ]);

    // 5. WONDERLAND
    console.log("Seeding Wonderland...");
    await Wonderland.create({
      title: { az: "Wonderland Lunapark", en: "Wonderland Theme Park", ru: "Лунапарк Wonderland" },
      tag: { az: "Əyləncə Mərkəzi", en: "Entertainment Center", ru: "Развлекательный Центр" },
      workingHours: "10:00 - 23:00",
      description: {
        az: "Bütün yaş qrupları üçün nəzərdə tutulmuş müasir əyləncə aparatları və lunapark cihazları. Unudulmaz anlar yaşamaq üçün mükəmməl məkan.",
        en: "Modern amusement machines and theme park rides designed for all age groups. A perfect place to experience unforgettable moments.",
        ru: "Современные аттракционы и карусели для всех возрастных групп. Идеальное место для незабываемых моментов."
      },
      discount: { enabled: true, percentage: 10 },
      tickets: [
        { name: { az: "Böyüklər üçün", en: "For Adults", ru: "Для Взрослых" }, price: "15 AZN" },
        { name: { az: "Uşaqlar üçün", en: "For Children", ru: "Для Детей" }, price: "10 AZN" }
      ],
      smallAttractions: [
        {
          name: { az: "Çarpışan Maşınlar", en: "Bumper Cars", ru: "Бамперные Машинки" },
          description: { az: "Klassik və həyəcanlı.", en: "Classic and exciting.", ru: "Классические и захватывающие." },
          icon: "🚗"
        },
        {
          name: { az: "Qorxu Otağı", en: "House of Fear", ru: "Комната Страха" },
          description: { az: "Adrenalin və qorxu bir arada.", en: "Adrenaline and fear combined.", ru: "Адреналин и страх вместе." },
          icon: "👻"
        }
      ],
      bigAttractions: [
        {
          title: { az: "Əsas Karusellər", en: "Main Rides", ru: "Главные Карусели" },
          games: [
            {
              name: { az: "Şeytan Çarxı", en: "Ferris Wheel", ru: "Колесо Обозрения" },
              image: "/AF-aqua2.jpg",
              description: { az: "Dənizə yüksəklikdən baxın.", en: "Look at the sea from a height.", ru: "Посмотрите на море с высоты." }
            }
          ]
        }
      ]
    });

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
