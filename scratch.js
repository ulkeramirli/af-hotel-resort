const mongoose = require('mongoose');
const Booking = require('./src/models/Booking').default;
const Room = require('./src/models/Room').default;

async function run() {
  await mongoose.connect('mongodb://localhost:27017/af-hotel');
  const topRooms = await Booking.aggregate([
    { $group: { _id: '$room', bookings: { $sum: 1 } } },
    { $sort: { bookings: -1 } },
    { $limit: 5 }
  ]);
  console.log('Before populate:', JSON.stringify(topRooms));
  
  await Room.populate(topRooms, { path: '_id', select: 'name type price' });
  
  console.log('After populate:', JSON.stringify(topRooms));
  process.exit(0);
}
run();
