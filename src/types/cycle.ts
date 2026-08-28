import type { PaymentAllocationInput } from "./payment";

export type PaymentCycle =
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "SemiAnnual"
  | "Annual"
  | "OneTime";

export interface Cycle {
  id: string;
  label: string;
  description: string;
  paymentCycle: PaymentCycle;
  startDate: string;
  endDate: string;
  amount: number;
  isActive: boolean;
  balanceAllocations: PaymentAllocationInput[];
}

export type CycleInput = Pick<
  Cycle,
  "label" | "paymentCycle" | "startDate" | "endDate" | "amount" | "balanceAllocations"
> & {
  apartmentIds: string[];
};
