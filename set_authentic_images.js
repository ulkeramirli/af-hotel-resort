const mongoose = require('mongoose');
require('dotenv').config();

const images = {
  // Wiki authentic
  'qutab': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/K%C3%BCk%C3%BC-Gutab_Azerbaijani.gif?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=original',
  'lula': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Azerbaijani_lyulya_kebab.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=original',
  'kebab': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Lula_kebab_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=original',
  'ayran': 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Fresh_ayran.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=original',
  'lentil': 'https://upload.wikimedia.org/wikipedia/commons/6/61/EgFoodLentilSoup.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=original',
  'shawarma': 'https://upload.wikimedia.org/wikipedia/commons/0/00/Shawarma_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=original',
  'trout': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Salmo_trutta.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=original',
  'jam': 'https://upload.wikimedia.org/wikipedia/commons/8/88/Az-Strawberry_jam%2C_making_by_e-citizen_%28moonsun1981%29.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=original',
  'cheese': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Feta_Cheese.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=original',
  
  // TheMealDB
  'salad': 'https://www.themealdb.com/images/media/meals/7ytdtz1784833420.jpg',
  'chicken soup': 'https://www.themealdb.com/images/media/meals/7kb44y1763589084.jpg',
  'fries': 'https://www.themealdb.com/images/media/meals/j223gc1784579841.jpg',
  'pizza': 'https://www.themealdb.com/images/media/meals/lrfdwz1764438393.jpg',
  'water': 'https://www.themealdb.com/images/media/meals/nmxec11782498644.jpg',
  'roast': 'https://www.themealdb.com/images/media/meals/ssrrrs1503664277.jpg',
  'egg': 'https://www.themealdb.com/images/media/meals/1529446137.jpg',
  'steak': 'https://www.themealdb.com/images/media/meals/vussxq1511882648.jpg',
  'liver': 'https://www.themealdb.com/images/media/meals/hob03q1780264260.jpg',
  'tea': 'https://www.themealdb.com/images/media/meals/vussxq1511882648.jpg',
  'chocolate': 'https://www.themealdb.com/images/media/meals/tqtywx1468317395.jpg',
  
  // Unsplash (Confirmed working)
  'chicken': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', // burger/chicken
  'fish': 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400',
  'fruit': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', // fruit/salad
  'cake': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400',
  'lemon': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' // using a fresh image
};

const mapItemToImage = (name) => {
  const n = name.toLowerCase();
  
  if (n.includes('pendir')) return images['cheese'];
  if (n.includes('buketi') || n.includes('assorti')) return images['salad'];
  if (n.includes('süzmə') || n.includes('acika')) return images['salad'];
  if (n.includes('limon')) return images['lemon'];
  
  if (n.includes('paytaxt') || n.includes('manqal')) return images['salad'];
  if (n.includes('toyuq salatı')) return images['salad'];
  if (n.includes('pomidor salatı')) return images['salad'];
  if (n.includes('çoban')) return images['salad'];
  
  if (n.includes('toyuq şorbası')) return images['chicken soup'];
  if (n.includes('mərci')) return images['lentil'];
  
  if (n.includes('fri')) return images['fries'];
  if (n.includes('nuggets')) return images['chicken'];
  if (n.includes('şaurma')) return images['shawarma'];
  if (n.includes('pizza')) return images['pizza'];
  
  if (n.includes('qutab')) return images['qutab'];
  
  if (n.includes('su') || n.includes('kola') || n.includes('limonad') || n.includes('kompot') || n.includes('şirəsi')) return images['water'];
  if (n.includes('ayran')) return images['ayran']; 
  
  if (n.includes('sac')) return images['roast'];
  if (n.includes('soyutma')) return images['chicken'];
  if (n.includes('yumurta')) return images['egg'];
  if (n.includes('çığırtma') || n.includes('tabaka') || n.includes('langet')) return images['chicken'];
  
  if (n.includes('farel') || n.includes('sudak') || n.includes('kütüm') || n.includes('kifal')) return images['trout'];
  
  if (n.includes('lülə')) return images['lula'];
  if (n.includes('kabab')) return images['kebab'];
  if (n.includes('antrikot') || n.includes('basdırma')) return images['steak'];
  if (n.includes('ciyər')) return images['liver'];
  if (n.includes('külləmə') || n.includes('kartof quyruq')) return images['fries'];
  
  if (n.includes('çay') || n.includes('samovar') || n.includes('çanik')) return images['tea'];
  if (n.includes('mürəbbə')) return images['jam'];
  if (n.includes('alpen') || n.includes('snickers')) return images['chocolate'];
  if (n.includes('şirniyyat')) return images['cake'];
  if (n.includes('meyvə') || n.includes('yemiş') || n.includes('qarpız')) return images['fruit'];
  
  return images['salad'];
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({
    name: Object, description: Object, image: String, workingHours: Object, phone: String, menu: Array
  }, { strict: false }));
  
  let rest = await Restaurant.findOne({ 'name.en': 'AF Beach Family Restaurant' });
  if (!rest) { console.log('Not found'); process.exit(1); }
  
  let menu = rest.menu;
  menu.forEach(category => {
    category.items.forEach(item => {
      item.image = mapItemToImage(item.name.az);
    });
  });
  
  await Restaurant.updateOne({ _id: rest._id }, { $set: { menu: menu } });
  console.log('Authentic images updated!');
  process.exit();
});
