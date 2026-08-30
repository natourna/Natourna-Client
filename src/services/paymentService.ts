import type { PagedResult } from "../types/paged";
import type { Payment, PaymentInput } from "../types/payment";

export interface PaymentListFilters {
  isPaid?: boolean;
  overdue?: boolean;
}

export interface PaymentService {
  getPayments(): Promise<Payment[]>;
  getUnpaidPayments(): Promise<Payment[]>;
  getPaymentsPage(page: number, pageSize: number, filters: PaymentListFilters): Promise<PagedResult<Payment>>;
  getPaymentsByApartment(apartmentId: string): Promise<Payment[]>;
  createPayment(input: PaymentInput): Promise<Payment>;
  markPaymentAsPaid(id: string): Promise<Payment>;
}
