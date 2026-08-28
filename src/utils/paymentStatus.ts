import { formatShortDate } from "./date";

export type PaymentStatus = "paid" | "due" | "overdue";

export function paymentStatus(
  item: { isPaid: boolean; dueDate: string },
  today: string,
): PaymentStatus {
  if (item.isPaid) return "paid";
  return item.dueDate < today ? "overdue" : "due";
}

export const statusLabels: Record<PaymentStatus, string> = {
  paid: "Paid",
  due: "Not paid yet",
  overdue: "Overdue",
};

export function apartmentStandingLabel(status: PaymentStatus, outstanding: string): string {
  if (status === "paid") return "Paid up";
  return status === "due" ? `Owes ${outstanding}` : `Overdue ${outstanding}`;
}

export function paymentDateText(
  item: { dueDate: string; paymentDate: string | null },
  status: PaymentStatus,
): string {
  if (status === "paid" && item.paymentDate) return `paid ${formatShortDate(item.paymentDate)}`;
  if (status === "overdue") return `was due ${formatShortDate(item.dueDate)}`;
  return `due ${formatShortDate(item.dueDate)}`;
}
