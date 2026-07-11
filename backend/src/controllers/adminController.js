import { asyncHandler } from '../utils/apiError.js';
import { ApiError } from '../utils/apiError.js';
import { Booking, Owner, PG, User } from '../models/index.js';

export const getUsers = asyncHandler(async (req, res) => {
  console.log("Query:", req.query);

  const allUsers = await User.find().select("name email role");
  console.log("All Users:", allUsers);

  const normalizedRole = normalizeRole(req.query.role);

  console.log("Normalized Role:", normalizedRole);

  const filter = normalizedRole
    ? { role: normalizedRole }
    : { role: { $in: ["TENANT", "OWNER"] } };

  console.log("Filter:", filter);

  const users = await User.find(filter)
    .select("-password")
    .populate({
      path: "owner",
      select: "governmentId verificationStatus",
      populate: {
        path: "pgs",
      },
    });

  console.log("Returned:", users.length);

  res.json(users);
});

export const getAllOwners = asyncHandler(async (req, res) => {
  const owners = await Owner.find()
    .populate({ path: 'user', select: 'name email phone role verified createdAt' })
    .populate({ path: 'pgs', select: 'name city state status rentStartingFrom availableBeds' })
    .sort({ createdAt: -1 });

  res.json(owners);
});

export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.verified = false;
  await user.save();
  res.json({ message: 'User blocked', user });
});

export const getPendingPgs = asyncHandler(async (req, res) => {
  const pgs = await PG.find({ status: 'PENDING' }).populate({
    path: 'owner',
    populate: { path: 'user' },
  });
  res.json(pgs);
});

export const reviewPgListing = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'APPROVED' | 'REJECTED'
  const pg = await PG.findById(req.params.id);
  if (!pg) throw new ApiError(404, 'PG not found');
  pg.status = status;
  await pg.save();
  res.json({ message: `Listing ${status.toLowerCase()}`, pg });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalOwners, totalPgs, approvedPgs, totalBookings, pendingBookings] = await Promise.all([
    User.countDocuments({ role: 'TENANT' }),
    User.countDocuments({ role: 'OWNER' }),
    PG.countDocuments(),
    PG.countDocuments({ status: 'APPROVED' }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'PENDING' }),
  ]);

  res.json({ totalUsers, totalOwners, totalPgs, approvedPgs, totalBookings, pendingBookings });
});

function normalizeRole(role) {
  if (!role) return null;

  const value = role.toString().trim().toLowerCase();
  const aliases = {
    owner: 'OWNER',
    owners: 'OWNER',
    tenant: 'TENANT',
    tenants: 'TENANT',
    teanent: 'TENANT',
    teanents: 'TENANT',
    tenent: 'TENANT',
    tenents: 'TENANT',
    admin: 'ADMIN',
    admins: 'ADMIN',
    user: null,
    users: null,
    all: null,
  };

  return Object.prototype.hasOwnProperty.call(aliases, value) ? aliases[value] : undefined;
}
