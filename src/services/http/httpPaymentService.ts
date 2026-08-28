import { pagedSchema } from "../../schemas/common";
import { paymentSchema } from "../../schemas/payment";
import type { PaymentInput } from "../../types/payment";
import type { PaymentListParams, PaymentService } from "../paymentService";
import { fetchAllPages } from "./fetchAllPages";
import { request } from "./httpClient";

const pagedPaymentsSchema = pagedSchema(paymentSchema);

export const httpPaymentService: PaymentService = {
  getPayments(params: PaymentListParams) {
    return request("/Payment", {
      query: {
        page: params.page,
        pageSize: params.pageSize,
        apartmentId: params.apartmentId !== undefined ? Number(params.apartmentId) : undefined,
        isPaid: params.isPaid,
        dueBefore: params.dueBefore,
      },
      schema: pagedPaymentsSchema,
    });
  },

  getAllPayments(filter?: { isPaid?: boolean }) {
    return fetchAllPages((page, pageSize) =>
      httpPaymentService.getPayments({ page, pageSize, isPaid: filter?.isPaid }),
    );
  },

  getPaymentsByApartment(apartmentId: string) {
    return fetchAllPages((page, pageSize) =>
      httpPaymentService.getPayments({ page, pageSize, apartmentId }),
    );
  },

  createPayment(input: PaymentInput) {
    return request("/Payment", {
      method: "POST",
      body: {
        apartmentId: Number(input.apartmentId),
        label: input.label,
        amount: input.amount,
        dueDate: input.dueDate,
        allocations: input.allocations.map((allocation) => ({
          balanceId: Number(allocation.balanceId),
          percentage: allocation.percentage,
        })),
      },
      schema: paymentSchema,
    });
  },

  markPaymentAsPaid(id: string) {
    return request(`/Payment/${id}/mark-as-paid`, { method: "PATCH", schema: paymentSchema });
  },
};
