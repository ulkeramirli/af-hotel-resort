const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/af-hotel';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // Fix trailing space in "Standard Double " room name
  const result = await db.collection('rooms').updateOne(
    { _id: new ObjectId('6a54e596abb086f8647ccb70') },
    { $set: { 
      'name.az': 'Standard Double', 
      'name.en': 'Standard Double', 
      'name.ru': 'Standard Double'
    }}
  );
  console.log('Trimmed room name trailing space:', result.modifiedCount);

  await client.close();
}

run().catch(err => { console.error(err); process.exit(1); });
