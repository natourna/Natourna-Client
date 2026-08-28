import type { z } from "zod";
import type { billInputSchema, billSchema } from "../schemas/bill";

export type Bill = z.infer<typeof billSchema>;

export type BillInput = z.infer<typeof billInputSchema>;
