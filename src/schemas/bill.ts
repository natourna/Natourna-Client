import { z } from "zod";
import { fallbackTextSchema, idSchema, nullableDateOnlySchema, requiredDateOnlySchema } from "./common";

export const billSchema = z.object({
  id: idSchema,
  label: fallbackTextSchema,
  amount: z.number(),
  dueDate: requiredDateOnlySchema,
  isPaid: z.boolean(),
  paymentDate: nullableDateOnlySchema,
  balanceId: idSchema,
  balanceName: fallbackTextSchema,
});

export const billInputSchema = z.object({
  label: z.string().trim().min(1, "Enter what this bill is for."),
  amount: z.number().positive("The amount must be greater than zero."),
  dueDate: z.string().min(1, "Choose a due date."),
  balanceId: z.string().min(1, "Choose a fund."),
});
