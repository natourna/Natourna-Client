import type { BillService } from "../billService";
import { request } from "../http";
import { fetchAllPages } from "./paged";
import { billSchema, pagedSchema } from "./schemas";

const pagedBillsSchema = pagedSchema(billSchema);

export const apiBillService: BillService = {
  getBills() {
    return fetchAllPages((page, pageSize) => request("/Bill", pagedBillsSchema, { query: { page, pageSize } }));
  },

  getBillsPage(page, pageSize) {
    return request("/Bill", pagedBillsSchema, { query: { page, pageSize } });
  },

  createBill(input) {
    return request("/Bill", billSchema, {
      method: "POST",
      body: {
        label: input.label,
        amount: input.amount,
        dueDate: input.dueDate,
        balanceId: Number(input.balanceId),
      },
    });
  },

  markBillAsPaid(id) {
    return request(`/Bill/${id}/mark-as-paid`, billSchema, { method: "PATCH" });
  },
};
