import { asyncHandler } from '../utils/apiError.js';
import { ApiError } from '../utils/apiError.js';
import { Owner, PG, Room } from '../models/index.js';

async function getOwnerId(userId) {
  const owner = await Owner.findOne({ user: userId });
  return owner?.id;
}

export const getRoomsForPg = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ pg: req.params.pgId });
  res.json(rooms);
});

export const createRoom = asyncHandler(async (req, res) => {
  const ownerId = await getOwnerId(req.user.id);
  if (!ownerId) throw new ApiError(404, 'Owner profile not found');

  const pg = await PG.findById(req.params.pgId);
  if (!pg) throw new ApiError(404, 'PG not found');
  if (!idsMatch(pg.owner, ownerId)) throw new ApiError(403, 'You do not own this PG');

  const room = await Room.create({ ...req.body, pg: req.params.pgId });
  await recalculatePgBedCounts(req.params.pgId);

  res.status(201).json({ message: 'Room added', room });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const ownerId = await getOwnerId(req.user.id);
  if (!ownerId) throw new ApiError(404, 'Owner profile not found');

  const room = await assertOwnsRoom(req.params.id, ownerId);
  const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  await recalculatePgBedCounts(room.pg._id);

  res.json({ message: 'Room updated', room: updated });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const ownerId = await getOwnerId(req.user.id);
  if (!ownerId) throw new ApiError(404, 'Owner profile not found');

  const room = await assertOwnsRoom(req.params.id, ownerId);
  await room.deleteOne();
  await recalculatePgBedCounts(room.pg._id);

  res.json({ message: 'Room deleted' });
});

async function assertOwnsRoom(roomId, ownerId) {
  const room = await Room.findById(roomId).populate('pg');
  if (!room) throw new ApiError(404, 'Room not found');
  if (!idsMatch(room.pg.owner, ownerId)) throw new ApiError(403, 'You do not own this room');
  return room;
}

export async function recalculatePgBedCounts(pgId) {
  const rooms = await Room.find({ pg: pgId });
  const totalBeds = rooms.reduce((sum, room) => sum + room.occupancy * (room.availableCount >= 0 ? 1 : 0), 0);
  const availableBeds = rooms.reduce((sum, room) => sum + room.availableCount, 0);

  await PG.findByIdAndUpdate(pgId, { totalBeds, availableBeds });
}

function idsMatch(left, right) {
  return left?.toString() === right?.toString();
}
