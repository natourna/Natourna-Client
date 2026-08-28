export interface PaymentAllocation {
  balanceId: string;
  percentage: number;
  allocatedAmount: number;
}

export interface Payment {
  id: string;
  label: string;
  amount: number;
  paymentDate: string | null;
  dueDate: string;
  isPaid: boolean;
  apartmentId: string;
  apartmentOwner: string;
  apartmentTenant: string | null;
  cycleId: string | null;
  cycleName: string | null;
  recurrent: boolean;
  allocations: PaymentAllocation[];
}

export type PaymentAllocationInput = Omit<PaymentAllocation, "allocatedAmount">;

export type PaymentInput = Pick<
  Payment,
  "label" | "amount" | "dueDate" | "apartmentId"
> & {
  allocations: PaymentAllocationInput[];
};
