const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/af-hotel';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const restaurants = await db.collection('restaurants').find({}).toArray();
  const items = new Set();
  
  restaurants.forEach(r => {
    const cats = [...(r.menu || []), ...(r.menuCategories || [])];
    cats.forEach(c => {
      if (c.items) {
        c.items.forEach(i => {
          items.add(i.name?.az || i.name);
        });
      }
    });
  });
  
  console.log([...items].join('\n'));
  await client.close();
}
run().catch(console.error);
