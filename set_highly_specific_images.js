const mongoose = require('mongoose');
require('dotenv').config();

const specificImages = {
  'çoban salatı': 'https://upload.wikimedia.org/wikipedia/commons/9/97/Bo%C5%9Fqabda_bol_reyhanl%C4%B1_%C3%A7oban_salat%C4%B1.jpg',
  'süzmə': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Labneh01.jpg',
  'tikə kabab': 'https://upload.wikimedia.org/wikipedia/commons/1/17/Shashlik.jpg',
  'ciyər kabab': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Qaraciy%C9%99r_kabab%C4%B1.jpg',
  'ciyər quyruq': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Qaraciy%C9%99r_kabab%C4%B1.jpg',
  'kompot': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Peach_kompot.JPG'
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
      const azName = item.name.az.toLowerCase();
      
      // Override with highly specific images if they match
      for (const [key, url] of Object.entries(specificImages)) {
        if (azName.includes(key)) {
          item.image = url;
        }
      }
    });
  });
  
  await Restaurant.updateOne({ _id: rest._id }, { $set: { menu: menu } });
  console.log('Highly specific images updated!');
  process.exit();
});
