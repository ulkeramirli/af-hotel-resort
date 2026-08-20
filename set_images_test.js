const mongoose = require('mongoose');
require('dotenv').config();

const categoryImages = {
  'SOYUQ QƏLYANALTILAR': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'SALATLAR': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'ŞORBALAR': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
  'FAST FOOD': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 
  'QUTABLAR': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  'SƏRİN İÇKİLƏR': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400',
  'SAC YEMƏKLƏRİ': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', 
  'BALIQ YEMƏKLƏRİ': 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400',
  'KABABLAR': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  'ÇAY DƏSTGAHI': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400'
};

const itemImages = {
  'Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  'Toyuq nuggets': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  'Şaurma': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  'Qarpız': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'Limon': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'Şirniyyat': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400',
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
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
  console.log('Images updated with working URLs!');
  process.exit();
});
