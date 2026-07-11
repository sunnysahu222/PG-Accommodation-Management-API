import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseOptions.js';

const amenitiesSchema = new mongoose.Schema(
  {
    pg: { type: mongoose.Schema.Types.ObjectId, ref: 'PG', required: true, unique: true },
    wifi: { type: Boolean, default: false },
    food: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    washingMachine: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    powerBackup: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

amenitiesSchema.virtual('pgId').get(function () {
  return this.pg?._id?.toString() || this.pg?.toString();
});

export default mongoose.model('Amenities', amenitiesSchema);
