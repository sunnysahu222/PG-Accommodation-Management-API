import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseOptions.js';

const imageSchema = new mongoose.Schema(
  {
    pg: { type: mongoose.Schema.Types.ObjectId, ref: 'PG', required: true, index: true },
    imageUrl: { type: String, required: true },
  },
  baseSchemaOptions,
);

imageSchema.virtual('pgId').get(function () {
  return this.pg?._id?.toString() || this.pg?.toString();
});

export default mongoose.model('Image', imageSchema);
