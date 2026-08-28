export interface Bill {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paymentDate: string | null;
  balanceId: string;
  balanceName: string;
}

export type BillInput = Omit<Bill, "id" | "isPaid" | "paymentDate" | "balanceName">;
