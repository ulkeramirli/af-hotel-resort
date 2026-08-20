const mongoose = require('mongoose');
require('dotenv').config();

const mealImgs = {
  "cheese": "https://www.themealdb.com/images/media/meals/oal8x31764119345.jpg",
  "salad": "https://www.themealdb.com/images/media/meals/7ytdtz1784833420.jpg",
  "tomato": "https://www.themealdb.com/images/media/meals/stpuws1511191310.jpg",
  "chicken soup": "https://www.themealdb.com/images/media/meals/7kb44y1763589084.jpg",
  "lentil": "https://www.themealdb.com/images/media/meals/vpxyqt1511464175.jpg",
  "fries": "https://www.themealdb.com/images/media/meals/j223gc1784579841.jpg",
  "chicken": "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg",
  "shawarma": "https://www.themealdb.com/images/media/meals/kcv6hj1598733479.jpg",
  "pizza": "https://www.themealdb.com/images/media/meals/lrfdwz1764438393.jpg",
  "pie": "https://www.themealdb.com/images/media/meals/ysxwuq1487323065.jpg", // used for qutab
  "water": "https://www.themealdb.com/images/media/meals/nmxec11782498644.jpg",
  "lemon": "https://www.themealdb.com/images/media/meals/rjhf741585564676.jpg",
  "roast": "https://www.themealdb.com/images/media/meals/ssrrrs1503664277.jpg", // saj
  "egg": "https://www.themealdb.com/images/media/meals/1529446137.jpg",
  "fish": "https://www.themealdb.com/images/media/meals/p02vq41763754350.jpg",
  "kofta": "https://www.themealdb.com/images/media/meals/lgmnff1763789847.jpg",
  "kebab": "https://www.themealdb.com/images/media/meals/04axct1763793018.jpg",
  "steak": "https://www.themealdb.com/images/media/meals/vussxq1511882648.jpg",
  "liver": "https://www.themealdb.com/images/media/meals/hob03q1780264260.jpg",
  "potato": "https://www.themealdb.com/images/media/meals/1550441882.jpg",
  "tea": "https://www.themealdb.com/images/media/meals/vussxq1511882648.jpg",
  "jam": "https://www.themealdb.com/images/media/meals/ysqupp1511640538.jpg",
  "chocolate": "https://www.themealdb.com/images/media/meals/tqtywx1468317395.jpg",
  "cake": "https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg",
  "fruit": "https://www.themealdb.com/images/media/meals/dk70uv1784670127.jpg",
  "drink": "https://www.themealdb.com/images/media/meals/nmxec11782498644.jpg" // water glass for drinks
};

// Also I found some valid unsplash urls before:
// 200 https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400 (Salad healthy)
// 200 https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400 (Meat bbq)
// 200 https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400 (Pizza)
// 200 https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400 (Burger / fast food)
// 200 https://images.unsplash.com/photo-1547592180-85f173990554?w=400 (Soup)
// 200 https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400 (Fish salmon)
// 200 https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400 (Tea)
// 200 https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400 (Drinks / mint)
// 200 https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400 (Bread / dough)

const mapItemToImage = (name) => {
  const n = name.toLowerCase();
  
  if (n.includes('pendir')) return mealImgs['cheese'];
  if (n.includes('buketi') || n.includes('assorti')) return mealImgs['salad'];
  if (n.includes('süzmə') || n.includes('acika')) return mealImgs['tomato'];
  if (n.includes('limon')) return mealImgs['lemon'];
  
  if (n.includes('paytaxt') || n.includes('manqal')) return mealImgs['salad'];
  if (n.includes('toyuq salatı')) return mealImgs['salad'];
  if (n.includes('pomidor salatı')) return mealImgs['tomato'];
  if (n.includes('çoban')) return mealImgs['salad'];
  
  if (n.includes('toyuq şorbası')) return mealImgs['chicken soup'];
  if (n.includes('mərci')) return mealImgs['lentil'];
  
  if (n.includes('fri')) return mealImgs['fries'];
  if (n.includes('nuggets')) return mealImgs['chicken'];
  if (n.includes('şaurma')) return mealImgs['shawarma'];
  if (n.includes('pizza')) return mealImgs['pizza'];
  
  if (n.includes('qutab')) return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400';
  
  if (n.includes('su') || n.includes('kola') || n.includes('limonad') || n.includes('kompot') || n.includes('şirəsi')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400';
  if (n.includes('ayran')) return mealImgs['water']; // ayran glass
  
  if (n.includes('sac')) return mealImgs['roast'];
  if (n.includes('soyutma')) return mealImgs['chicken'];
  if (n.includes('yumurta')) return mealImgs['egg'];
  if (n.includes('çığırtma') || n.includes('tabaka') || n.includes('langet')) return mealImgs['chicken'];
  
  if (n.includes('farel') || n.includes('kifal') || n.includes('sudak') || n.includes('kütüm')) return mealImgs['fish'];
  
  if (n.includes('lülə')) return mealImgs['kofta'];
  if (n.includes('kabab')) return mealImgs['kebab'];
  if (n.includes('antrikot') || n.includes('basdırma')) return mealImgs['steak'];
  if (n.includes('ciyər')) return mealImgs['liver'];
  if (n.includes('külləmə') || n.includes('kartof quyruq')) return mealImgs['potato'];
  
  if (n.includes('çay') || n.includes('samovar') || n.includes('çanik')) return mealImgs['tea'];
  if (n.includes('mürəbbə')) return mealImgs['jam'];
  if (n.includes('alpen') || n.includes('snickers')) return mealImgs['chocolate'];
  if (n.includes('şirniyyat')) return mealImgs['cake'];
  if (n.includes('meyvə') || n.includes('yemiş') || n.includes('qarpız')) return mealImgs['fruit'];
  
  return mealImgs['salad'];
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
  console.log('Images precisely mapped and updated!');
  process.exit();
});
