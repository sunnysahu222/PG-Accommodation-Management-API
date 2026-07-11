import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseOptions.js';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pg: { type: mongoose.Schema.Types.ObjectId, ref: 'PG', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  baseSchemaOptions,
);

reviewSchema.virtual('userId').get(function () {
  return this.user?._id?.toString() || this.user?.toString();
});

reviewSchema.virtual('pgId').get(function () {
  return this.pg?._id?.toString() || this.pg?.toString();
});

export default mongoose.model('Review', reviewSchema);
