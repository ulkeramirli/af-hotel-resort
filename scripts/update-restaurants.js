const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/af-hotel';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  console.log('Clearing existing restaurants...');
  await db.collection('restaurants').deleteMany({});

  const restaurants = [
    {
      name: {
        az: "AF Əsas Restoran",
        en: "AF Main Restaurant",
        ru: "AF Главный Ресторан"
      },
      tag: {
        az: "BEYNƏLXALQ MƏTBƏX",
        en: "INTERNATIONAL CUISINE",
        ru: "МЕЖДУНАРОДНАЯ КУХНЯ"
      },
      description: {
        az: "Milli və beynəlxalq mətbəxin ən ləziz təamlarından ibarət zəngin açıq bufet səhər yeməyi və şam yeməyi ilə gününüzə ləzzət qatın. Zövqlə dizayn edilmiş geniş zalımızda hər bir qonaq üçün xüsusi xidmət təklif edirik.",
        en: "Add flavor to your day with our rich open buffet breakfast and dinner, featuring the most delicious dishes of national and international cuisine. We offer personalized service in our elegantly designed spacious hall.",
        ru: "Добавьте вкуса своему дню с нашим богатым завтраком и ужином в формате шведского стола, предлагающим самые вкусные блюда национальной и международной кухни. Мы предлагаем индивидуальное обслуживание в нашем элегантно оформленном просторном зале."
      },
      images: [
        "/AF-aqua2.jpg"
      ],
      workingHours: "07:00 - 23:00",
      rating: 4.8,
      menuCategories: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: {
        az: "Aqua Lounge Bar",
        en: "Aqua Lounge Bar",
        ru: "Аква Лаунж Бар"
      },
      tag: {
        az: "HOVUZKƏNARI / İÇKİLƏR",
        en: "POOLSIDE / DRINKS",
        ru: "У БАССЕЙНА / НАПИТКИ"
      },
      description: {
        az: "Hovuz kənarında sərinləşdirici içkilər, ekzotik kokteyllər və yüngül qəlyanaltılarla dincəlmək üçün ideal məkan. Tətilinizin ləzzətini çıxararkən musiqi sədaları altında xüsusi qarışıqlarımızı dadın.",
        en: "The ideal place to relax by the pool with refreshing drinks, exotic cocktails, and light snacks. Taste our special blends accompanied by music while enjoying your vacation.",
        ru: "Идеальное место для отдыха у бассейна с освежающими напитками, экзотическими коктейлями и легкими закусками. Попробуйте наши фирменные смеси под звуки музыки, наслаждаясь отпуском."
      },
      images: [
        "/AF-aqua.jpg"
      ],
      workingHours: "10:00 - 00:00",
      rating: 4.6,
      menuCategories: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: {
        az: "\"Xəzər\" Dəniz Restoranı",
        en: "\"Caspian\" Seafood Restaurant",
        ru: "Морской Ресторан \"Каспий\""
      },
      tag: {
        az: "DƏNİZ MƏHSULLARI",
        en: "SEAFOOD",
        ru: "МОРЕПРОДУКТЫ"
      },
      description: {
        az: "Xəzər dənizinin bənzərsiz mənzərəsi qarşısında ən təzə dəniz məhsullarından hazırlanan ləziz yeməklərdən zövq alın. Romantik şam yeməkləri və xüsusi günlər üçün mükəmməl atmosfer.",
        en: "Enjoy delicious meals prepared from the freshest seafood in front of the unique view of the Caspian Sea. The perfect atmosphere for romantic dinners and special occasions.",
        ru: "Насладитесь вкусными блюдами, приготовленными из свежайших морепродуктов, с уникальным видом на Каспийское море. Идеальная атмосфера для романтических ужинов и особых случаев."
      },
      images: [
        "/AF-aqua2.jpg"
      ],
      workingHours: "18:00 - 02:00",
      rating: 4.9,
      menuCategories: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('restaurants').insertMany(restaurants);
  console.log(`Seeded ${restaurants.length} restaurants!`);

  // Let's also update the Restaurant Settings page text to be premium
  await db.collection('settings').updateOne(
    { _id: 'restaurant' },
    { $set: {
      tag: {
        az: "QASTONAROMİYA TƏCRÜBƏSİ",
        en: "GASTRONOMIC EXPERIENCE",
        ru: "ГАСТРОНОМИЧЕСКИЙ ОПЫТ"
      },
      title: {
        az: "Dadlı Təamlar Dünyası",
        en: "World of Delicious Tastes",
        ru: "Мир Вкусных Блюд"
      },
      subtitle: {
        az: "Hər bir anınıza ləzzət qatan, müxtəlif zövqlərə xitab edən 3 fərqli restoranımızda unudulmaz qastronomiya səyahətinə çıxın.",
        en: "Embark on an unforgettable gastronomic journey in our 3 different restaurants that add flavor to your every moment and appeal to various tastes.",
        ru: "Отправьтесь в незабываемое гастрономическое путешествие в наших 3 различных ресторанах, которые добавят вкуса каждому вашему моменту и удовлетворят любые вкусы."
      }
    }},
    { upsert: true }
  );
  console.log('Updated restaurant settings text!');

  await client.close();
}

run().catch(err => { console.error(err); process.exit(1); });
