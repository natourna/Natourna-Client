import { z } from "zod";
import { fallbackTextSchema, idSchema } from "./common";

export const buildingSchema = z.object({
  id: idSchema,
  name: fallbackTextSchema,
  numberOfApartments: z.number().int(),
  floors: z.number().int(),
  compoundId: idSchema,
});
