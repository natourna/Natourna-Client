import { z } from "zod";
import { idSchema } from "./common";

export const balanceSchema = z.object({
  id: idSchema,
  label: z.string(),
  currentAmount: z.number(),
  compoundId: idSchema,
});
