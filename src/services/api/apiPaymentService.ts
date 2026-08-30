import type { PaymentService } from "../paymentService";
import { request } from "../http";
import { fetchAllPages } from "./paged";
import { pagedSchema, paymentSchema } from "./schemas";

const pagedPaymentsSchema = pagedSchema(paymentSchema);

export const apiPaymentService: PaymentService = {
  getPayments() {
    return fetchAllPages((page, pageSize) => request("/Payment", pagedPaymentsSchema, { query: { page, pageSize } }));
  },

  getUnpaidPayments() {
    return fetchAllPages((page, pageSize) =>
      request("/Payment", pagedPaymentsSchema, { query: { page, pageSize, isPaid: false } }),
    );
  },

  getPaymentsPage(page, pageSize, filters) {
    return request("/Payment", pagedPaymentsSchema, {
      query: { page, pageSize, isPaid: filters.isPaid, overdue: filters.overdue },
    });
  },

  getPaymentsByApartment(apartmentId) {
    return fetchAllPages((page, pageSize) =>
      request(`/Payment/apartment/${apartmentId}`, pagedPaymentsSchema, { query: { page, pageSize } }),
    );
  },

  createPayment(input) {
    return request("/Payment", paymentSchema, {
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
    });
  },

  markPaymentAsPaid(id) {
    return request(`/Payment/${id}/mark-as-paid`, paymentSchema, { method: "PATCH" });
  },
};
