import { z } from "zod";
import { totalPercentage } from "../utils/percentage";
import { dateOnlySchema, fallbackTextSchema, idSchema } from "./common";
import { paymentAllocationInputSchema } from "./payment";

export const paymentCycleSchema = z.enum([
  "Weekly",
  "Monthly",
  "Quarterly",
  "SemiAnnual",
  "Annual",
  "OneTime",
]);

const storedAllocationsSchema = z.array(
  z.object({
    balanceId: z.number().int(),
    percentage: z.number(),
  }),
);

function parseStoredAllocations(value: string | null) {
  if (!value) return [];
  try {
    const parsed = storedAllocationsSchema.safeParse(JSON.parse(value));
    if (!parsed.success) return [];
    return parsed.data.map((allocation) => ({
      balanceId: String(allocation.balanceId),
      percentage: allocation.percentage,
    }));
  } catch {
    return [];
  }
}

export const cycleSchema = z.object({
  id: idSchema,
  label: fallbackTextSchema,
  description: fallbackTextSchema,
  paymentCycle: paymentCycleSchema,
  startDate: dateOnlySchema,
  endDate: dateOnlySchema,
  amount: z.number(),
  isActive: z.boolean(),
  balanceAllocations: z.string().nullable().transform(parseStoredAllocations),
});

export const cycleInputSchema = z.object({
  label: z.string().trim().min(1, "Enter a name for this cycle."),
  paymentCycle: paymentCycleSchema,
  startDate: z.string().min(1, "Choose a start date."),
  endDate: z.string().min(1, "Choose an end date."),
  amount: z.number().positive("The amount must be greater than zero."),
  balanceAllocations: z
    .array(paymentAllocationInputSchema)
    .refine(
      (allocations) => totalPercentage(allocations.map((allocation) => allocation.percentage)) === 100,
      "Allocations must add up to exactly 100%.",
    ),
  apartmentIds: z.array(z.string()).min(1, "Select at least one apartment."),
});
