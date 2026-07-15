const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/af-hotel';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  console.log('Fetching restaurants to add menus...');
  const restaurants = await db.collection('restaurants').find({}).toArray();

  for (let r of restaurants) {
    let menuCategories = [];

    if (r.name.en === "AF Main Restaurant") {
      menuCategories = [
        {
          name: { az: "İsti Yeməklər", en: "Hot Dishes", ru: "Горячие блюда" },
          items: [
            {
              name: { az: "Quzu Kebabı", en: "Lamb Kebab", ru: "Шашлык из баранины" },
              description: { az: "Xüsusi ədviyyatlarla marinad olunmuş quzu əti", en: "Lamb marinated with special spices", ru: "Баранина, маринованная со специальными специями" },
              price: 25,
              image: "/spoon.png",
              spicy: false,
              vegan: false
            },
            {
              name: { az: "Toyuq Şığırtması", en: "Chicken Chigirtma", ru: "Куриная Чигиртма" },
              description: { az: "Kənd toyuğu, pomidor, soğan və kənd yumurtası", en: "Village chicken, tomatoes, onions, and village eggs", ru: "Деревенская курица, помидоры, лук и деревенские яйца" },
              price: 18,
              image: "/spoon.png",
              spicy: false,
              vegan: false
            }
          ]
        },
        {
          name: { az: "Şorbalar", en: "Soups", ru: "Супы" },
          items: [
            {
              name: { az: "Mərci Şorbası", en: "Lentil Soup", ru: "Чечевичный суп" },
              description: { az: "Qırmızı mərci, nanə və limon", en: "Red lentils, mint, and lemon", ru: "Красная чечевица, мята и лимон" },
              price: 8,
              image: "/spoon.png",
              spicy: false,
              vegan: true
            }
          ]
        }
      ];
    } else if (r.name.en === "Aqua Lounge Bar") {
      menuCategories = [
        {
          name: { az: "Sərinləşdirici İçkilər", en: "Refreshing Drinks", ru: "Освежающие напитки" },
          items: [
            {
              name: { az: "Tropik Limonad", en: "Tropical Lemonade", ru: "Тропический лимонад" },
              description: { az: "Təzə sıxılmış meyvə şirələri və nanə", en: "Freshly squeezed fruit juices and mint", ru: "Свежевыжатые фруктовые соки и мята" },
              price: 12,
              image: "/spoon.png",
              spicy: false,
              vegan: true
            },
            {
              name: { az: "Mojito", en: "Mojito", ru: "Мохито" },
              description: { az: "Klassik və ya çiyələkli", en: "Classic or strawberry", ru: "Классический или клубничный" },
              price: 15,
              image: "/spoon.png",
              spicy: false,
              vegan: true
            }
          ]
        },
        {
          name: { az: "Snack & Qəlyanaltı", en: "Snacks", ru: "Закуски" },
          items: [
            {
              name: { az: "Klub Sendviç", en: "Club Sandwich", ru: "Клубный Сэндвич" },
              description: { az: "Toyuq qrili, vetçina, pendir, kartof fri ilə", en: "Grilled chicken, ham, cheese, served with french fries", ru: "Курица гриль, ветчина, сыр, подается с картофелем фри" },
              price: 18,
              image: "/spoon.png",
              spicy: false,
              vegan: false
            }
          ]
        }
      ];
    } else if (r.name.en === "\"Caspian\" Seafood Restaurant") {
      menuCategories = [
        {
          name: { az: "Dəniz Məhsulları", en: "Seafood", ru: "Морепродукты" },
          items: [
            {
              name: { az: "Nərə Balığı Qrildə", en: "Grilled Sturgeon", ru: "Осетрина на гриле" },
              description: { az: "Xəzər dənizindən təzə nərə balığı, narlar, qızardılmış tərəvəzlər", en: "Fresh Caspian sturgeon, pomegranate, roasted vegetables", ru: "Свежая каспийская осетрина, гранат, запеченные овощи" },
              price: 45,
              image: "/spoon.png",
              spicy: false,
              vegan: false
            },
            {
              name: { az: "Karides Tava", en: "Shrimp Pan", ru: "Креветки на сковороде" },
              description: { az: "Kərə yağı, sarımsaq və pul bibərlə qızardılmış xüsusi karideslər", en: "Special shrimps fried with butter, garlic, and red pepper flakes", ru: "Специальные креветки, жареные со сливочным маслом, чесноком и хлопьями красного перца" },
              price: 35,
              image: "/spoon.png",
              spicy: true,
              vegan: false
            }
          ]
        }
      ];
    }

    await db.collection('restaurants').updateOne(
      { _id: r._id },
      { $set: { menuCategories } }
    );
  }

  console.log('Seeded menus for restaurants!');
  await client.close();
}

run().catch(console.error);
