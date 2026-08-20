const mongoose = require('mongoose');
require('dotenv').config();

const categoryImages = {
  'SOYUQ QƏLYANALTILAR': 'https://images.unsplash.com/photo-1481070555726-e2fe83477d4c?auto=format&fit=crop&w=400&q=80',
  'SALATLAR': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
  'ŞORBALAR': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80',
  'FAST FOOD': 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80', 
  'QUTABLAR': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  'SƏRİN İÇKİLƏR': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
  'SAC YEMƏKLƏRİ': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80', 
  'BALIQ YEMƏKLƏRİ': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
  'KABABLAR': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
  'ÇAY DƏSTGAHI': 'https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?auto=format&fit=crop&w=400&q=80'
};

const itemImages = {
  'Pizza': 'https://images.unsplash.com/photo-1513104890d38-7c7f8a7d30d9?auto=format&fit=crop&w=400&q=80',
  'Toyuq nuggets': 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80',
  'Şaurma': 'https://images.unsplash.com/photo-1646754876251-24da08c6cce2?auto=format&fit=crop&w=400&q=80',
  'Qarpız': 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=400&q=80',
  'Limon': 'https://images.unsplash.com/photo-1590502593747-4229879f758f?auto=format&fit=crop&w=400&q=80',
  'Şirniyyat': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
};

mongoose.connect(process.env.DATABASE_URL).then(async () => {
  const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({
    name: Object, description: Object, image: String, workingHours: Object, phone: String, menu: Array
  }, { strict: false }));
  
  let rest = await Restaurant.findOne({ 'name.en': 'AF Beach Family Restaurant' });
  if (!rest) { console.log('Not found'); process.exit(1); }
  
  let menu = rest.menu;
  menu.forEach(category => {
    const catName = category.name.az;
    const defaultImg = categoryImages[catName] || '';
    
    category.items.forEach(item => {
      let img = defaultImg;
      if (item.name.az.includes('Pizza')) img = itemImages['Pizza'];
      if (item.name.az.includes('nuggets')) img = itemImages['Toyuq nuggets'];
      if (item.name.az.includes('Şaurma')) img = itemImages['Şaurma'];
      if (item.name.az.includes('Qarpız')) img = itemImages['Qarpız'];
      if (item.name.az.includes('Limon')) img = itemImages['Limon'];
      if (item.name.az.includes('Şirniyyat')) img = itemImages['Şirniyyat'];
      
      item.image = img;
    });
  });
  
  await Restaurant.updateOne({ _id: rest._id }, { $set: { menu: menu } });
  console.log('Images updated!');
  process.exit();
});
