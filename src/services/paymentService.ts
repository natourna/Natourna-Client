import type { Paged, PageParams } from "../types/paging";
import type { Payment, PaymentInput } from "../types/payment";

export interface PaymentListParams extends PageParams {
  apartmentId?: string;
  isPaid?: boolean;
  dueBefore?: string;
}

export interface PaymentService {
  getPayments(params: PaymentListParams): Promise<Paged<Payment>>;
  getAllPayments(filter?: { isPaid?: boolean }): Promise<Payment[]>;
  getPaymentsByApartment(apartmentId: string): Promise<Payment[]>;
  createPayment(input: PaymentInput): Promise<Payment>;
  markPaymentAsPaid(id: string): Promise<Payment>;
}
