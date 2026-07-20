const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/af-hotel';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log("Updating Activity Settings (Aquapark main text)...");
    const settingsColl = db.collection('activitysettings');
    
    // Clear and set the main aquapark setting
    await settingsColl.deleteMany({});
    await settingsColl.insertOne({
      tag: { az: "AQUA & BEACH RESORT", en: "AQUA & BEACH RESORT", ru: "AQUA & BEACH RESORT" },
      title: { az: "Akvapark", en: "Aquapark", ru: "Аквапарк" },
      subtitle: { 
        az: "Xəzər sahilində bölgənin ən böyük əyləncə, hovuz və özəl çimərlik kompleksi", 
        en: "The region's largest entertainment, pool, and private beach complex on the Caspian coast", 
        ru: "Крупнейший комплекс развлечений, бассейнов и частного пляжа на побережье Каспия" 
      },
      stats: [
        { value: { az: "10+", en: "10+", ru: "10+" }, label: { az: "Əyləncə Növü", en: "Entertainment Types", ru: "Видов развлечений" }, sub: { az: "Tennis, Bilyard, Fitnes və s.", en: "Tennis, Billiards, Fitness etc.", ru: "Теннис, бильярд, фитнес и др." } },
        { value: { az: "4", en: "4", ru: "4" }, label: { az: "Hovuz Zonası", en: "Pool Zones", ru: "Зоны бассейнов" }, sub: { az: "VIP, Uşaq, AF Beach və Akvapark", en: "VIP, Kids, AF Beach & Aquapark", ru: "VIP, Детский, AF Beach и Аквапарк" } },
        { value: { az: "09:00 - 19:00", en: "09:00 - 19:00", ru: "09:00 - 19:00" }, label: { az: "İş Saatları", en: "Working Hours", ru: "Часы работы" }, sub: { az: "Hər gün", en: "Every day", ru: "Каждый день" } },
        { value: { az: "🎬", en: "🎬", ru: "🎬" }, label: { az: "Açıq Hava Kinosu", en: "Open Air Cinema", ru: "Кино под открытым небом" }, sub: { az: "Tezliklə", en: "Coming Soon", ru: "Скоро" } }
      ]
    });

    console.log("Updating Tickets...");
    const ticketsColl = db.collection('tickets');
    await ticketsColl.deleteMany({});
    await ticketsColl.insertMany([
      {
        name: { az: "Körpələr (0-3 yaş)", en: "Infants (0-3 years)", ru: "Младенцы (0-3 лет)" },
        price: "Ödənişsiz",
        features: []
      },
      {
        name: { az: "Uşaqlar (3-12 yaş)", en: "Children (3-12 years)", ru: "Дети (3-12 лет)" },
        price: "20 AZN",
        features: []
      },
      {
        name: { az: "Böyüklər (12+ yaş)", en: "Adults (12+ years)", ru: "Взрослые (12+ лет)" },
        price: "25 AZN",
        features: []
      }
    ]);

    console.log("Updating FAQs...");
    const faqsColl = db.collection('faqs');
    await faqsColl.deleteMany({});
    await faqsColl.insertMany([
      {
        question: { az: "Hovuzların iş saatları necədir?", en: "What are the pool working hours?", ru: "Каковы часы работы бассейнов?" },
        answer: { az: "Hovuzlar hər gün 09:00 - 19:00 aralığında fəaliyyət göstərir.", en: "The pools are open every day from 09:00 to 19:00.", ru: "Бассейны работают каждый день с 09:00 до 19:00." }
      },
      {
        question: { az: "Qiymətə nələr daxildir?", en: "What is included in the price?", ru: "Что входит в стоимость?" },
        answer: { az: "Qiymətə daxildir: aquapark, hovuzlar, uşaq hovuzu, dənizkənarı ərazidən istifadə, çətir, tennis, bilyard, batut, yaşıllıq əraziləri, uşaqlar üçün oyun yerləri və s.", en: "The price includes: aquapark, pools, kids pool, seaside area usage, umbrella, tennis, billiards, trampoline, green areas, kids playgrounds, etc.", ru: "В стоимость входит: аквапарк, бассейны, детский бассейн, использование прибрежной зоны, зонт, теннис, бильярд, батут, зеленые зоны, детские игровые площадки и т.д." }
      },
      {
        question: { az: "Dəsmal verilirmi?", en: "Are towels provided?", ru: "Выдаются ли полотенца?" },
        answer: { az: "Bəli, dəsmal verilir.", en: "Yes, towels are provided.", ru: "Да, полотенца выдаются." }
      },
      {
        question: { az: "İçəri qida və su keçirmək olarmı?", en: "Is outside food and water allowed?", ru: "Можно ли проносить еду и воду с собой?" },
        answer: { az: "Xeyr, içəri qida və su buraxılmır.", en: "No, outside food and water are not allowed.", ru: "Нет, проносить еду и воду с собой запрещено." }
      }
    ]);

    console.log("Updating Activity Categories and Activities...");
    const categoriesColl = db.collection('activitycategories');
    const activitiesColl = db.collection('activities');
    
    await categoriesColl.deleteMany({});
    await activitiesColl.deleteMany({});

    // Create Categories
    const resAqua = await categoriesColl.insertOne({
      name: { az: "Hovuzlar və Akvapark", en: "Pools & Aquapark", ru: "Бассейны и Аквапарк" },
      description: { az: "Bütün yaşlar üçün hovuz və sürüşmələr", en: "Pools and slides for all ages", ru: "Бассейны и горки для всех возрастов" },
      emoji: "🌊"
    });
    const idAqua = resAqua.insertedId;

    const resSport = await categoriesColl.insertOne({
      name: { az: "İdman və Əyləncə", en: "Sports & Entertainment", ru: "Спорт и Развлечения" },
      description: { az: "Tennis, bilyard və fitnes", en: "Tennis, billiards and fitness", ru: "Теннис, бильярд и фитнес" },
      emoji: "🎾"
    });
    const idSport = resSport.insertedId;

    const resKids = await categoriesColl.insertOne({
      name: { az: "Uşaq Zonası", en: "Kids Zone", ru: "Детская Зона" },
      description: { az: "Uşaq oyun yerləri və batut", en: "Kids playgrounds and trampoline", ru: "Детские площадки и батут" },
      emoji: "🎠"
    });
    const idKids = resKids.insertedId;

    const resCinema = await categoriesColl.insertOne({
      name: { az: "Açıq Hava Kinosu", en: "Open Air Cinema", ru: "Кинотеатр под открытым небом" },
      description: { az: "Tezliklə dəniz kənarında kino", en: "Coming soon by the sea", ru: "Скоро кино у моря" },
      emoji: "🎬"
    });
    const idCinema = resCinema.insertedId;

    // Create Activities
    const acts = [
      // Aqua
      { category: idAqua, title: { az: "Böyüklər üçün aquapark lı hovuz", en: "Adult pool with aquapark", ru: "Взрослый бассейн с аквапарком" }, description: { az: "Əyləncəli sürüşmələr və böyük hovuz", en: "Fun slides and a large pool", ru: "Веселые горки и большой бассейн" }, image: "/pools/adult_aquapark.png" },
      { category: idAqua, title: { az: "Uşaqlar üçün hovuz", en: "Kids pool", ru: "Детский бассейн" }, description: { az: "Balacalar üçün təhlükəsiz su oyunları", en: "Safe water games for the little ones", ru: "Безопасные водные игры для малышей" }, image: "/pools/kids_pool.png" },
      { category: idAqua, title: { az: "VIP hovuz", en: "VIP pool", ru: "VIP бассейн" }, description: { az: "Sakitlik və lüks axtaranlar üçün xüsusi hovuz", en: "Special pool for those seeking peace and luxury", ru: "Специальный бассейн для ищущих покой и роскошь" }, image: "/pools/vip_pool.png" },
      { category: idAqua, title: { az: "Böyüklər üçün bir digər hovuz", en: "Another adult pool", ru: "Еще один бассейн для взрослых" }, description: { az: "Professional üzgüçülük və istirahət üçün", en: "For professional swimming and relaxation", ru: "Для профессионального плавания и отдыха" }, image: "/pools/adult_pool_2.png" },
      { category: idAqua, title: { az: "Af Beach böyüklər üçün hovuz", en: "AF Beach adult pool", ru: "AF Beach бассейн для взрослых" }, description: { az: "Dəniz mənzərəli böyüklər hovuzu", en: "Adult pool with a sea view", ru: "Взрослый бассейн с видом на море" }, image: "/pools/beach_adult_pool.png" },
      { category: idAqua, title: { az: "Af Beach uşaqlar üçün hovuz", en: "AF Beach kids pool", ru: "AF Beach детский бассейн" }, description: { az: "Çimərlik zonasında uşaqlar üçün təhlükəsiz hovuz", en: "Safe kids pool in the beach zone", ru: "Безопасный детский бассейн в пляжной зоне" }, image: "/pools/beach_kids_pool.png" },
      
      // Sport
      { category: idSport, title: { az: "Tennis Kortu", en: "Tennis Court", ru: "Теннисный Корт" }, description: { az: "Açıq havada peşəkar kortlar", en: "Professional outdoor courts", ru: "Профессиональные открытые корты" }, image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&q=80" },
      { category: idSport, title: { az: "Bilyard Zalı", en: "Billiards Room", ru: "Бильярдный Зал" }, description: { az: "Geniş və rahat bilyard salonu", en: "Spacious and comfortable billiards lounge", ru: "Просторный и удобный бильярдный салон" }, image: "https://images.unsplash.com/photo-1520115372410-b96dc36b415a?w=600&q=80" },
      { category: idSport, title: { az: "Fitnes Mərkəzi", en: "Fitness Center", ru: "Фитнес Центр" }, description: { az: "Müasir avadanlıqlarla təchiz olunmuş zal", en: "Gym equipped with modern equipment", ru: "Тренажерный зал с современным оборудованием" }, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80" },

      // Kids
      { category: idKids, title: { az: "Batut və Oyun Yeri", en: "Trampoline & Playground", ru: "Батут и Игровая Площадка" }, description: { az: "Uşaqların əyləncəsi üçün hər şey", en: "Everything for kids' entertainment", ru: "Всё для развлечения детей" }, image: "https://images.unsplash.com/photo-1628101490212-6f2043e74c83?w=600&q=80" },
      { category: idKids, title: { az: "Yaşıllıq Əraziləri", en: "Green Areas", ru: "Зеленые Зоны" }, description: { az: "Təmiz hava və təbiət qoynunda gəzinti", en: "Fresh air and walks in nature", ru: "Свежий воздух и прогулки на природе" }, image: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=600&q=80" },

      // Cinema
      { category: idCinema, title: { az: "Dəniz Kənarında Proyektor", en: "Seaside Projector", ru: "Проектор у Моря" }, description: { az: "Dalğaların səsi altında dünya şedevrləri", en: "World masterpieces under the sound of waves", ru: "Шедевры мирового кино под шум волн" }, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80" }
    ];
    await activitiesColl.insertMany(acts);

    console.log("Successfully seeded Aquapark data!");
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}
run();
