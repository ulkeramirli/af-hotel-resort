const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({}, { strict: false }));
  let rest = await Restaurant.findOne({ 'name.en': 'AF Beach Family Restaurant' });
  if (!rest) process.exit(1);
  
  let menu = rest.menu;
  menu.forEach(category => {
    category.items.forEach(item => {
      item.image = '';
    });
  });
  
  await Restaurant.updateOne({ _id: rest._id }, { $set: { menu: menu } });
  console.log('Images cleared!');
  process.exit();
});
