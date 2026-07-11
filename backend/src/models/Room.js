import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseOptions.js';

const roomSchema = new mongoose.Schema(
  {
    pg: { type: mongoose.Schema.Types.ObjectId, ref: 'PG', required: true, index: true },
    roomType: { type: String, required: true },
    occupancy: { type: Number, required: true },
    rent: { type: Number, required: true },
    availableCount: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

roomSchema.virtual('pgId').get(function () {
  return this.pg?._id?.toString() || this.pg?.toString();
});

roomSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'room',
});

export default mongoose.model('Room', roomSchema);
