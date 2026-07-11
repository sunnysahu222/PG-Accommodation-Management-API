import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseOptions.js';

const pgSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    genderType: { type: String, enum: ['MALE', 'FEMALE', 'UNISEX'], required: true },
    totalBeds: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 0 },
    rentStartingFrom: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING', index: true },
  },
  baseSchemaOptions,
);

pgSchema.virtual('ownerId').get(function () {
  return this.owner?._id?.toString() || this.owner?.toString();
});

pgSchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'pg',
});

pgSchema.virtual('amenities', {
  ref: 'Amenities',
  localField: '_id',
  foreignField: 'pg',
  justOne: true,
});

pgSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'pg',
});

pgSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'pg',
});

export default mongoose.model('PG', pgSchema);
