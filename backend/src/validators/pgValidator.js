import { z } from 'zod';

export const createPgSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  genderType: z.enum(['MALE', 'FEMALE', 'UNISEX']),
  rentStartingFrom: z.number().positive(),
  amenities: z
    .object({
      wifi: z.boolean().optional(),
      food: z.boolean().optional(),
      ac: z.boolean().optional(),
      parking: z.boolean().optional(),
      washingMachine: z.boolean().optional(),
      gym: z.boolean().optional(),
      cctv: z.boolean().optional(),
      powerBackup: z.boolean().optional(),
    })
    .optional(),
});

export const updatePgSchema = createPgSchema.partial();

export const createRoomSchema = z.object({
  roomType: z.string().min(2),
  occupancy: z.number().int().positive(),
  rent: z.number().positive(),
  availableCount: z.number().int().nonnegative(),
});

export const updateRoomSchema = createRoomSchema.partial();
