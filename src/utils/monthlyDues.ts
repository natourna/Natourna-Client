import { isSameMonth } from "./date";

interface DuesPayment {
  apartmentId: string;
  amount: number;
  isPaid: boolean;
  dueDate: string;
}

export interface MonthlyDues {
  collected: number;
  expected: number;
  stillOwed: number;
  paidApartments: number;
  totalApartments: number;
}

export function monthlyDues(payments: DuesPayment[], reference: Date): MonthlyDues {
  const monthPayments = payments.filter((payment) => isSameMonth(payment.dueDate, reference));
  const collected = monthPayments
    .filter((payment) => payment.isPaid)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const expected = monthPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const apartmentIds = [...new Set(monthPayments.map((payment) => payment.apartmentId))];
  const paidApartments = apartmentIds.filter((id) =>
    monthPayments
      .filter((payment) => payment.apartmentId === id)
      .every((payment) => payment.isPaid),
  ).length;
  return {
    collected,
    expected,
    stillOwed: expected - collected,
    paidApartments,
    totalApartments: apartmentIds.length,
  };
}
