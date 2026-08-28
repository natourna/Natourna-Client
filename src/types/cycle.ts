import type { z } from "zod";
import type { cycleInputSchema, cycleSchema, paymentCycleSchema } from "../schemas/cycle";

export type PaymentCycle = z.infer<typeof paymentCycleSchema>;

export type Cycle = z.infer<typeof cycleSchema>;

export type CycleInput = z.infer<typeof cycleInputSchema>;
