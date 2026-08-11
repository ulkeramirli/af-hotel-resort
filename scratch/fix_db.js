const mongoose = require('mongoose');

async function fix() {
  await mongoose.connect('mongodb://127.0.0.1:27017/af-hotel');
  const db = mongoose.connection.db;
  const items = await db.collection('activitycategories').find().toArray();
  for (let i of items) {
    if (i.name.az === 'Akvapark') await db.collection('activitycategories').updateOne({_id: i._id}, {$set: {order: 1}});
    if (i.name.az === 'Hovuzlar') await db.collection('activitycategories').updateOne({_id: i._id}, {$set: {order: 2}});
    if (i.name.az === 'İdman və Fitnes') await db.collection('activitycategories').updateOne({_id: i._id}, {$set: {order: 3}});
  }
  const updated = await db.collection('activitycategories').find().toArray();
  updated.forEach(i => console.log(i.name.az, '| order:', i.order));
  await mongoose.disconnect();
}

fix().catch(console.error);
