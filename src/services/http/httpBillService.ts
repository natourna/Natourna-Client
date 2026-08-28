import { billSchema } from "../../schemas/bill";
import { pagedSchema } from "../../schemas/common";
import type { BillInput } from "../../types/bill";
import type { BillListParams, BillService } from "../billService";
import { fetchAllPages } from "./fetchAllPages";
import { request } from "./httpClient";

const pagedBillsSchema = pagedSchema(billSchema);

export const httpBillService: BillService = {
  getBills(params: BillListParams) {
    return request("/Bill", {
      query: {
        page: params.page,
        pageSize: params.pageSize,
        isPaid: params.isPaid,
      },
      schema: pagedBillsSchema,
    });
  },

  getAllBills(filter?: { isPaid?: boolean }) {
    return fetchAllPages((page, pageSize) =>
      httpBillService.getBills({ page, pageSize, isPaid: filter?.isPaid }),
    );
  },

  createBill(input: BillInput) {
    return request("/Bill", {
      method: "POST",
      body: {
        label: input.label,
        amount: input.amount,
        dueDate: input.dueDate,
        balanceId: Number(input.balanceId),
      },
      schema: billSchema,
    });
  },

  markBillAsPaid(id: string) {
    return request(`/Bill/${id}/mark-as-paid`, { method: "PATCH", schema: billSchema });
  },
};
