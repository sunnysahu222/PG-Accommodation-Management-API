import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import mongoose from './config/db.js';
import { Amenities, Booking, Image, Owner, PG, Review, Room, User } from './models/index.js';
import { recalculatePgBedCounts } from './controllers/roomController.js';

dotenv.config();

async function main() {
  await connectDB();

  const password = await bcrypt.hash('password123', 10);

  const demoEmails = ['admin@pgplatform.com', 'owner@pgplatform.com', 'tenant@pgplatform.com'];
  const existingDemoUsers = await User.find({ email: { $in: demoEmails } }).select('_id');
  const existingDemoOwners = await Owner.find({ user: { $in: existingDemoUsers.map((user) => user._id) } }).select('_id');
  const existingDemoPgs = await PG.find({
    $or: [{ name: { $in: demoPgs.map((pg) => pg.name) } }, { owner: { $in: existingDemoOwners.map((owner) => owner._id) } }],
  }).select('_id');
  const existingDemoRooms = await Room.find({ pg: { $in: existingDemoPgs.map((pg) => pg._id) } }).select('_id');

  await Promise.all([
    Booking.deleteMany({ room: { $in: existingDemoRooms.map((room) => room._id) } }),
    Review.deleteMany({ pg: { $in: existingDemoPgs.map((pg) => pg._id) } }),
    Amenities.deleteMany({ pg: { $in: existingDemoPgs.map((pg) => pg._id) } }),
    Image.deleteMany({ pg: { $in: existingDemoPgs.map((pg) => pg._id) } }),
    Room.deleteMany({ pg: { $in: existingDemoPgs.map((pg) => pg._id) } }),
    PG.deleteMany({ _id: { $in: existingDemoPgs.map((pg) => pg._id) } }),
    Owner.deleteMany({ _id: { $in: existingDemoOwners.map((owner) => owner._id) } }),
    User.deleteMany({ email: { $in: demoEmails } }),
  ]);

  await User.create({
    name: 'Admin User',
    email: 'admin@pgplatform.com',
    password,
    role: 'ADMIN',
    verified: true,
  });

  const ownerUser = await User.create({
    name: 'Demo Owner',
    email: 'owner@pgplatform.com',
    password,
    role: 'OWNER',
    verified: true,
  });

  const owner = await Owner.create({
    user: ownerUser._id,
    verificationStatus: 'APPROVED',
  });

  await User.create({
    name: 'Demo Tenant',
    email: 'tenant@pgplatform.com',
    password,
    role: 'TENANT',
    verified: true,
  });

  const createdPgs = [];

  for (const pgSeed of demoPgs) {
    const { amenities, imageUrl, rooms, ...pgData } = pgSeed;
    const pg = await PG.create({ ...pgData, owner: owner._id, status: 'APPROVED' });

    await Amenities.create({ ...amenities, pg: pg._id });
    await Image.create({ pg: pg._id, imageUrl });
    await Room.insertMany(rooms.map((room) => ({ ...room, pg: pg._id })));
    await recalculatePgBedCounts(pg._id);

    createdPgs.push(pg);
  }

  console.log('Seed complete:');
  console.log('  Admin:  admin@pgplatform.com / password123');
  console.log('  Owner:  owner@pgplatform.com / password123');
  console.log('  Tenant: tenant@pgplatform.com / password123');
  console.log(`  Sample PGs created: ${createdPgs.map((pg) => pg.name).join(', ')}`);
}

const demoPgs = [
  {
    name: 'Sunrise PG for Men',
    description: 'A clean, well-maintained PG close to the tech park, with home-style food.',
    address: '12 MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    genderType: 'MALE',
    rentStartingFrom: 8000,
    amenities: { wifi: true, food: true, parking: true, cctv: true, powerBackup: true },
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
    rooms: [
      { roomType: 'Single', occupancy: 1, rent: 12000, availableCount: 2 },
      { roomType: 'Double Sharing', occupancy: 2, rent: 8000, availableCount: 4 },
    ],
  },
  {
    name: 'Green Nest Ladies PG',
    description: 'Secure and peaceful women-only PG near metro, markets, and offices.',
    address: '42 Indiranagar 12th Main',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    genderType: 'FEMALE',
    rentStartingFrom: 9500,
    amenities: { wifi: true, food: true, ac: true, washingMachine: true, cctv: true, powerBackup: true },
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    rooms: [
      { roomType: 'Single', occupancy: 1, rent: 15000, availableCount: 1 },
      { roomType: 'Triple Sharing', occupancy: 3, rent: 9500, availableCount: 5 },
    ],
  },
  {
    name: 'Urban Stay CoLive',
    description: 'Modern unisex coliving space with quick access to IT hubs and cafes.',
    address: '88 Hitech City Road',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    genderType: 'UNISEX',
    rentStartingFrom: 10000,
    amenities: { wifi: true, food: false, ac: true, parking: true, gym: true, cctv: true },
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    rooms: [
      { roomType: 'Single', occupancy: 1, rent: 17000, availableCount: 2 },
      { roomType: 'Double Sharing', occupancy: 2, rent: 10000, availableCount: 6 },
    ],
  },
  {
    name: 'Comfort Corner PG',
    description: 'Budget-friendly PG with food, laundry, and easy local transport.',
    address: '19 Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201309',
    genderType: 'UNISEX',
    rentStartingFrom: 7000,
    amenities: { wifi: true, food: true, washingMachine: true, cctv: true },
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    rooms: [
      { roomType: 'Double Sharing', occupancy: 2, rent: 8500, availableCount: 3 },
      { roomType: 'Triple Sharing', occupancy: 3, rent: 7000, availableCount: 6 },
    ],
  },
  {
    name: 'Metro View PG',
    description: 'Premium PG near business parks with AC rooms and power backup.',
    address: '7 Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    genderType: 'MALE',
    rentStartingFrom: 12500,
    amenities: { wifi: true, food: true, ac: true, parking: true, cctv: true, powerBackup: true },
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    rooms: [
      { roomType: 'Single', occupancy: 1, rent: 22000, availableCount: 1 },
      { roomType: 'Double Sharing', occupancy: 2, rent: 12500, availableCount: 3 },
    ],
  },
  {
    name: 'Lake Side Student PG',
    description: 'Student-friendly stay close to colleges, libraries, and bus stops.',
    address: '25 Salt Lake Sector V',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    genderType: 'FEMALE',
    rentStartingFrom: 6500,
    amenities: { wifi: true, food: true, washingMachine: true, cctv: true, powerBackup: true },
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
    rooms: [
      { roomType: 'Double Sharing', occupancy: 2, rent: 7800, availableCount: 4 },
      { roomType: 'Triple Sharing', occupancy: 3, rent: 6500, availableCount: 6 },
    ],
  },
];

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
