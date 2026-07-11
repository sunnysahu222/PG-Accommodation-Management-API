import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseOptions.js';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  baseSchemaOptions,
);

bookingSchema.virtual('userId').get(function () {
  return this.user?._id?.toString() || this.user?.toString();
});

bookingSchema.virtual('roomId').get(function () {
  return this.room?._id?.toString() || this.room?.toString();
});

export default mongoose.model('Booking', bookingSchema);
