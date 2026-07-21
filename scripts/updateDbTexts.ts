import mongoose from 'mongoose';
import About from '../src/models/About';
import RoomSettings from '../src/models/RoomSettings';
import ActivitySettings from '../src/models/ActivitySettings';

const MONGO_URI = 'mongodb+srv://asadzadehali09_db_user:7L0YmBBMKfGHoYKZ@cluster.hpsurio.mongodb.net/af_hotel?appName=Cluster';

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Update or Create About
  let about = await About.findOne();
  if (!about) {
    about = new About({ images: ['/AF-aqua.jpg', '/AF-aqua2.jpg'] });
  }
  about.title = {
    az: 'MÜKƏMMƏLLİK VƏ ZƏRİFLİK',
    en: 'PERFECTION AND ELEGANCE',
    ru: 'СОВЕРШЕНСТВО И ЭЛЕГАНТНОСТЬ',
  };
  about.description = {
    az: '<p>AF Hotel & Aqua Park Resort, Xəzər sahilində gözəllik və rahatlığın unikal sintezini təqdim edir. Bənzərsiz xidmət səviyyəmiz və eksklüziv imkanlarımızla unudulmaz bir istirahət vəd edirik.</p>',
    en: '<p>AF Hotel & Aqua Park Resort offers a unique synthesis of beauty and comfort on the shores of the Caspian Sea. With our unparalleled service and exclusive facilities, we promise an unforgettable stay.</p>',
    ru: '<p>Курорт AF Hotel & Aqua Park предлагает уникальный синтез красоты и комфорта на берегу Каспийского моря. Благодаря непревзойденному сервису и эксклюзивным удобствам мы обещаем незабываемый отдых.</p>',
  };
  await about.save();
  console.log('Updated/Created About');

  // Update or Create RoomSettings
  let roomSettings = await RoomSettings.findOne();
  if (!roomSettings) {
    roomSettings = new RoomSettings();
  }
  roomSettings.tag = 'EKSKLÜZİV OTAQLAR & AİLƏVİ KOTECLƏR';
  roomSettings.title = 'Rahatlığın Gözəl Təcrübəsi';
  roomSettings.subtitle = 'Xüsusi dizayn edilmiş, yüksək komfortlu otaqlar və koteclərlə xidmətinizdəyik';
  await roomSettings.save();
  console.log('Updated/Created RoomSettings');

  // Update or Create ActivitySettings
  let activitySettings = await ActivitySettings.findOne();
  if (!activitySettings) {
    activitySettings = new ActivitySettings();
  }
  activitySettings.tag = 'GÖZƏL İSTİRAHƏT & AQUA PARK';
  activitySettings.title = 'Sonsuz Əyləncə və Rahatlıq';
  activitySettings.subtitle = 'Mükəmməl su attraksionları və geniş istirahət zonaları ilə unudulmaz anlar yaşayın';
  await activitySettings.save();
  console.log('Updated/Created ActivitySettings');

  console.log('Done!');
  process.exit(0);
}

main().catch(console.error);
