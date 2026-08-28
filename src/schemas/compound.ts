import { z } from "zod";
import { idSchema } from "./common";

export const compoundSchema = z.object({
  id: idSchema,
  name: z.string(),
  address: z.string(),
  activeApartments: z.number().int(),
});
