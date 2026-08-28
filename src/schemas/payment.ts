import { z } from "zod";
import { totalPercentage } from "../utils/percentage";
import {
  fallbackTextSchema,
  idSchema,
  nullableDateOnlySchema,
  nullableIdSchema,
  requiredDateOnlySchema,
} from "./common";

export const paymentAllocationSchema = z.object({
  balanceId: idSchema,
  percentage: z.number(),
  allocatedAmount: z.number(),
});

export const paymentSchema = z.object({
  id: idSchema,
  label: fallbackTextSchema,
  amount: z.number(),
  paymentDate: nullableDateOnlySchema,
  dueDate: requiredDateOnlySchema,
  isPaid: z.boolean(),
  apartmentId: idSchema,
  apartmentInfo: z
    .string()
    .nullable()
    .transform((value) => value ?? "—"),
  apartmentOwner: fallbackTextSchema,
  apartmentTenant: z.string().nullable(),
  cycleId: nullableIdSchema,
  cycleName: z.string().nullable(),
  recurrent: z.boolean(),
  allocations: z
    .array(paymentAllocationSchema)
    .nullable()
    .transform((value) => value ?? []),
});

export const paymentAllocationInputSchema = z.object({
  balanceId: z.string().min(1),
  percentage: z.number(),
});

export const paymentInputSchema = z.object({
  apartmentId: z.string().min(1, "Choose an apartment."),
  label: z.string().trim().min(1, "Enter what this payment is for."),
  amount: z.number().positive("The amount must be greater than zero."),
  dueDate: z.string().min(1, "Choose a due date."),
  allocations: z
    .array(paymentAllocationInputSchema)
    .refine(
      (allocations) => totalPercentage(allocations.map((allocation) => allocation.percentage)) === 100,
      "Allocations must add up to exactly 100%.",
    ),
});
