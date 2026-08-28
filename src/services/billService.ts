import type { Bill, BillInput } from "../types/bill";

export interface BillService {
  getBills(): Promise<Bill[]>;
  createBill(input: BillInput): Promise<Bill>;
  markBillAsPaid(id: string): Promise<Bill>;
}
