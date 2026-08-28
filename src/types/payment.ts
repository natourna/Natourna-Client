import type { z } from "zod";
import type {
  paymentAllocationInputSchema,
  paymentAllocationSchema,
  paymentInputSchema,
  paymentSchema,
} from "../schemas/payment";

export type PaymentAllocation = z.infer<typeof paymentAllocationSchema>;

export type Payment = z.infer<typeof paymentSchema>;

export type PaymentAllocationInput = z.infer<typeof paymentAllocationInputSchema>;

export type PaymentInput = z.infer<typeof paymentInputSchema>;
