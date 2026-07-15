const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://asadzadehali09_db_user:7L0YmBBMKfGHoYKZ@cluster.hpsurio.mongodb.net/af_hotel?appName=Cluster');

  const ActivitySettings = mongoose.model('ActivitySettings', new mongoose.Schema({}, {strict: false}));
  const RoomSettings = mongoose.model('RoomSettings', new mongoose.Schema({}, {strict: false}));
  const RestaurantSettings = mongoose.model('RestaurantSettings', new mongoose.Schema({}, {strict: false}));

  await ActivitySettings.updateMany({}, {
    '$set': {
      tag: { az: 'AQUA & BEACH RESORT', en: 'AQUA & BEACH RESORT', ru: 'AQUA & BEACH RESORT' },
      title: { az: 'Akvapark', en: 'Aquapark', ru: 'Аквапарк' },
      subtitle: { az: 'Xəzər sahilində bölgənin ən böyük əyləncə, hovuz və özəl çimərlik kompleksi', en: 'The largest entertainment, pool, and private beach complex on the Caspian coast', ru: 'Крупнейший развлекательный комплекс, бассейны и частный пляж на побережье Каспия' }
    }
  });

  await RoomSettings.updateMany({}, {
    '$set': {
      tag: { az: 'OTAQLAR VƏ KOTECLƏR', en: 'ROOMS & COTTAGES', ru: 'НОМЕРА И КОТТЕДЖИ' },
      title: { az: 'Rahatlığın Yeni Səviyyəsi', en: 'A New Level of Comfort', ru: 'Новый Уровень Комфорта' },
      subtitle: { az: 'Hər zövqə uyğun lüks otaqlar və koteclər', en: 'Luxury rooms and cottages for every taste', ru: 'Роскошные номера и коттеджи на любой вкус' }
    }
  });

  await RestaurantSettings.updateMany({}, {
    '$set': {
      tag: { az: 'RESTORANLARIMIZ & BAR', en: 'OUR RESTAURANTS & BAR', ru: 'НАШИ РЕСТОРАНЫ & БАР' },
      title: { az: 'Unudulmaz Qastrofəza Səyahəti', en: 'An Unforgettable Dining Journey', ru: 'Незабываемое Гастрономическое Путешествие' },
      subtitle: { az: 'AF Hotel & Resort ərazisində istirahətinizin hər anı üçün yaradılmış unikal konseptual məkanlar.', en: 'Unique conceptual spaces within AF Hotel & Resort, crafted for every moment of your leisure.', ru: 'Уникальные концептуальные пространства на территории AF Hotel & Resort, созданные для каждого мгновения вашего отдыха.' }
    }
  });

  console.log('Settings updated successfully!');
  process.exit(0);
}

run().catch(console.error);
