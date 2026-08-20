const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');

mongoose.connect(process.env.DATABASE_URL).then(async () => {
  const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({
    name: Object, description: Object, image: String, workingHours: Object, phone: String, menu: Array
  }, { strict: false }));
  
  let rest = await Restaurant.findOne({ 'name.en': 'AF Beach Family Restaurant' });
  
  const content = fs.readFileSync('insert_af_beach.ts', 'utf8');
  const match = content.match(/const menuData = (\[[\s\S]*?\]);\n\n  rest\.menu = menuData;/);
  if (match) {
    const menuData = eval(match[1]);
    await Restaurant.updateOne({ _id: rest._id }, { $set: { menu: menuData } });
    const updated = await Restaurant.findOne({ _id: rest._id });
    console.log('Categories:', updated.menu ? updated.menu.length : 'still no menu');
  } else {
    console.log("No match found");
  }
  process.exit();
});
