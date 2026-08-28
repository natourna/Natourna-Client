import type { Bill, BillInput } from "../types/bill";
import type { Paged, PageParams } from "../types/paging";

export interface BillListParams extends PageParams {
  isPaid?: boolean;
}

export interface BillService {
  getBills(params: BillListParams): Promise<Paged<Bill>>;
  getAllBills(filter?: { isPaid?: boolean }): Promise<Bill[]>;
  createBill(input: BillInput): Promise<Bill>;
  markBillAsPaid(id: string): Promise<Bill>;
}
