import { z } from "zod";
import { fallbackTextSchema, idSchema } from "./common";

export const apartmentSchema = z.object({
  id: idSchema,
  apartmentInfo: z.string(),
  owner: fallbackTextSchema,
  tenant: z.string().nullable(),
  isActive: z
    .boolean()
    .nullable()
    .transform((value) => value ?? false),
  floor: z.string(),
  buildingId: idSchema,
  buildingName: fallbackTextSchema,
});

export const apartmentInputSchema = z.object({
  apartmentInfo: z.string().trim().min(1, "Enter the apartment name or number."),
  floor: z.string().trim().min(1, "Enter the floor."),
  buildingId: z.string().min(1, "Choose a building."),
  owner: z.string().trim().min(1, "Enter the owner's name."),
  tenant: z.string().nullable(),
  isActive: z.boolean(),
});
