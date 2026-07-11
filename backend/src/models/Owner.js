import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseOptions.js';

const ownerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    governmentId: { type: String },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  baseSchemaOptions,
);

ownerSchema.virtual('userId').get(function () {
  return this.user?._id?.toString() || this.user?.toString();
});

ownerSchema.virtual('pgs', {
  ref: 'PG',
  localField: '_id',
  foreignField: 'owner',
});

export default mongoose.model('Owner', ownerSchema);
