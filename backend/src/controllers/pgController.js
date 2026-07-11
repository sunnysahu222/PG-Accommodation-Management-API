import { asyncHandler } from '../utils/apiError.js';
import { ApiError } from '../utils/apiError.js';
import { Amenities, Image, Owner, PG, Review, Room } from '../models/index.js';

export const getAllPgs = asyncHandler(async (req, res) => {
  const pgs = await findApprovedPgs(req.query);
  res.json(pgs);
});

export const getHomePgs = asyncHandler(async (req, res) => {
  const pgs = await findApprovedPgs(req.query);
  const filters = await getAvailableFilters();
  res.json({ pgs, filters });
});

export const getPgById = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id)
    .populate('images')
    .populate('amenities')
    .populate('rooms')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name avatar' },
    })
    .populate({
      path: 'owner',
      populate: { path: 'user', select: 'name phone email' },
    });

  if (!pg) throw new ApiError(404, 'PG not found');
  res.json(pg);
});

export const createPg = asyncHandler(async (req, res) => {
  // req.user.id is the User id, but PG.ownerId points to Owner.id —
  // we look up the Owner row tied to this user first.
  const owner = await Owner.findOne({ user: req.user.id });
  if (!owner) throw new ApiError(404, 'Owner profile not found');

  const { amenities, images, ...pgData } = req.body;
  const createdPg = await PG.create({
    ...pgData,
    owner: owner.id,
    status: 'PENDING',
  });

  if (amenities) {
    await Amenities.create({ ...amenities, pg: createdPg._id });
  }

  if (Array.isArray(images) && images.length > 0) {
    await Image.insertMany(images.map((image) => ({ ...image, pg: createdPg._id })));
  }

  const pg = await PG.findById(createdPg._id).populate('amenities').populate('images');
  res.status(201).json({ message: 'PG created, pending admin approval', pg });
});

export const updatePg = asyncHandler(async (req, res) => {
  const owner = await Owner.findOne({ user: req.user.id });
  if (!owner) throw new ApiError(404, 'Owner profile not found');

  const pg = await PG.findById(req.params.id);
  if (!pg) throw new ApiError(404, 'PG not found');
  if (!idsMatch(pg.owner, owner.id)) throw new ApiError(403, 'You do not own this listing');

  const { amenities, images, ...pgData } = req.body;
  Object.assign(pg, pgData);
  await pg.save();

  if (amenities) {
    await Amenities.findOneAndUpdate({ pg: pg._id }, { ...amenities, pg: pg._id }, { upsert: true, new: true });
  }

  if (Array.isArray(images)) {
    await Image.deleteMany({ pg: pg._id });
    if (images.length > 0) {
      await Image.insertMany(images.map((image) => ({ ...image, pg: pg._id })));
    }
  }

  const updatedPg = await PG.findById(pg._id).populate('amenities').populate('images').populate('rooms');
  res.json({ message: 'PG updated', pg: updatedPg });
});

export const deletePg = asyncHandler(async (req, res) => {
  const owner = await Owner.findOne({ user: req.user.id });
  if (!owner) throw new ApiError(404, 'Owner profile not found');

  const pg = await PG.findById(req.params.id);
  if (!pg) throw new ApiError(404, 'PG not found');
  if (!idsMatch(pg.owner, owner.id)) throw new ApiError(403, 'You do not own this listing');

  await Promise.all([
    Amenities.deleteOne({ pg: pg._id }),
    Image.deleteMany({ pg: pg._id }),
    Review.deleteMany({ pg: pg._id }),
    Room.deleteMany({ pg: pg._id }),
  ]);
  await pg.deleteOne();

  res.json({ message: 'PG deleted' });
});

async function findApprovedPgs(filters) {
  const { city, state, location, minBudget, maxBudget, gender, roomType, amenities, limit } = filters;
  const query = { status: 'APPROVED' };

  const locationValue = location || city;
  if (locationValue) {
    query.$or = [
      { city: new RegExp(`^${escapeRegex(locationValue)}$`, 'i') },
      { state: new RegExp(`^${escapeRegex(locationValue)}$`, 'i') },
      { address: new RegExp(escapeRegex(locationValue), 'i') },
    ];
  }
  if (state && !location) query.state = new RegExp(`^${escapeRegex(state)}$`, 'i');
  if (gender) query.genderType = gender.toUpperCase();
  if (minBudget || maxBudget) {
    query.rentStartingFrom = {};
    if (minBudget) query.rentStartingFrom.$gte = Number(minBudget);
    if (maxBudget) query.rentStartingFrom.$lte = Number(maxBudget);
  }

  if (roomType) {
    const rooms = await Room.find({ roomType: new RegExp(`^${escapeRegex(roomType)}$`, 'i') }).select('pg');
    query._id = { $in: rooms.map((room) => room.pg) };
  }

  if (amenities) {
    const amenityQuery = {};
    amenities.split(',').forEach((amenity) => {
      const key = amenity.trim();
      if (key) amenityQuery[key] = true;
    });
    const matchedAmenities = await Amenities.find(amenityQuery).select('pg');
    const amenityPgIds = matchedAmenities.map((item) => item.pg);
    query._id = query._id
      ? { $in: query._id.$in.filter((id) => amenityPgIds.some((amenityId) => idsMatch(amenityId, id))) }
      : { $in: amenityPgIds };
  }

  const pgsQuery = PG.find(query)
    .populate('images')
    .populate('amenities')
    .populate('rooms')
    .sort({ availableBeds: -1, rentStartingFrom: 1, createdAt: -1 });

  if (limit) pgsQuery.limit(Math.min(Number(limit) || 5, 20));
  return pgsQuery;
}

async function getAvailableFilters() {
  const [cities, states, roomTypes] = await Promise.all([
    PG.distinct('city', { status: 'APPROVED' }),
    PG.distinct('state', { status: 'APPROVED' }),
    Room.distinct('roomType'),
  ]);

  return {
    cities: cities.filter(Boolean).sort(),
    states: states.filter(Boolean).sort(),
    roomTypes: roomTypes.filter(Boolean).sort(),
    genderTypes: ['MALE', 'FEMALE', 'UNISEX'],
    amenities: ['wifi', 'food', 'ac', 'parking', 'washingMachine', 'gym', 'cctv', 'powerBackup'],
  };
}

function idsMatch(left, right) {
  return left?.toString() === right?.toString();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
