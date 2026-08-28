import type { Bill, BillInput } from "../types/bill";
import type { PagedResult } from "../types/paged";

export interface BillService {
  getBills(): Promise<Bill[]>;
  getBillsPage(page: number, pageSize: number): Promise<PagedResult<Bill>>;
  createBill(input: BillInput): Promise<Bill>;
  markBillAsPaid(id: string): Promise<Bill>;
}
