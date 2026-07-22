const mongoose = require('mongoose');
const Wonderland = require('./src/models/Wonderland').default;
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/af-hotel');
  
  const w = await Wonderland.findOne();
  if (w) {
    w.title = { az: 'AF Park', en: 'AF Park', ru: 'AF Park' };
    await w.save();
    console.log('Successfully updated Wonderland title to AF Park in the database.');
  } else {
    console.log('Wonderland not found in DB.');
  }
  
  process.exit(0);
}
run();
