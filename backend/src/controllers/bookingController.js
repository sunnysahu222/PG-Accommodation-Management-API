import { asyncHandler } from '../utils/apiError.js';
import { ApiError } from '../utils/apiError.js';
import { Booking, Owner, Room } from '../models/index.js';
import { recalculatePgBedCounts } from './roomController.js';

export const createBooking = asyncHandler(async (req, res) => {
  const { roomId, startDate, endDate } = req.body;

  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(404, 'Room not found');
  if (room.availableCount <= 0) throw new ApiError(400, 'No beds available in this room type');

  const booking = await Booking.create({
    user: req.user.id,
    room: roomId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  await booking.populate({ path: 'room', populate: { path: 'pg' } });
  res.status(201).json({ message: 'Booking requested', booking });
});

// GET /api/bookings behaves differently depending on role:
// tenants see their own bookings, owners see bookings on their properties.
export const getBookings = asyncHandler(async (req, res) => {
  if (req.user.role === 'OWNER') {
    const owner = await Owner.findOne({ user: req.user.id });
    if (!owner) throw new ApiError(404, 'Owner profile not found');
    const allBookings = await Booking.find()
      .populate({
        path: 'room',
        populate: { path: 'pg' },
      })
      .populate({ path: 'user', select: 'name email phone' })
      .sort({ createdAt: -1 });
    const bookings = allBookings.filter((booking) => idsMatch(booking.room?.pg?.owner, owner.id));
    return res.json(bookings);
  }

  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: 'room',
      populate: {
        path: 'pg',
        select: 'name city',
        populate: { path: 'images' },
      },
    })
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// PATCH /api/bookings/:id — used for both owner approve/reject AND
// tenant cancel, distinguished by role + requested status.
export const updateBooking = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (status === 'CANCELLED') {
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (!idsMatch(booking.user, req.user.id)) throw new ApiError(403, 'This is not your booking');

    if (booking.status === 'APPROVED') {
      await Room.findByIdAndUpdate(booking.room._id, { $inc: { availableCount: 1 } });
      await recalculatePgBedCounts(booking.room.pg);
    }

    booking.status = 'CANCELLED';
    await booking.save();
    return res.json({ message: 'Booking cancelled', booking });
  }

  const owner = await Owner.findOne({ user: req.user.id });
  if (!owner) throw new ApiError(404, 'Owner profile not found');

  const booking = await Booking.findById(req.params.id).populate({
    path: 'room',
    populate: { path: 'pg' },
  });
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (!idsMatch(booking.room.pg.owner, owner.id)) {
    throw new ApiError(403, 'You do not manage this property');
  }

  if (status === 'APPROVED' && booking.status !== 'APPROVED') {
    if (booking.room.availableCount <= 0) {
      throw new ApiError(400, 'No beds available - cannot approve');
    }
    await Room.findByIdAndUpdate(booking.room._id, { $inc: { availableCount: -1 } });
    await recalculatePgBedCounts(booking.room.pg._id);
  }

  booking.status = status;
  await booking.save();
  res.json({ message: `Booking ${status.toLowerCase()}`, booking });
});

function idsMatch(left, right) {
  return left?.toString() === right?.toString();
}
