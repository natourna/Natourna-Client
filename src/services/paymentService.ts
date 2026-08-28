import type { Payment, PaymentInput } from "../types/payment";

export interface PaymentService {
  getPayments(): Promise<Payment[]>;
  getPaymentsByApartment(apartmentId: string): Promise<Payment[]>;
  createPayment(input: PaymentInput): Promise<Payment>;
  markPaymentAsPaid(id: string): Promise<Payment>;
}
