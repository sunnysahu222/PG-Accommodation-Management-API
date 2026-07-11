import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseOptions.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['TENANT', 'OWNER', 'ADMIN'], default: 'TENANT' },
    avatar: { type: String },
    verified: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

userSchema.virtual('owner', {
  ref: 'Owner',
  localField: '_id',
  foreignField: 'user',
  justOne: true,
});

userSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
});

export default mongoose.model('User', userSchema);
