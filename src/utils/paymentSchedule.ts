import type { PaymentCycle } from "../types/cycle";

const monthsPerPeriod: Partial<Record<PaymentCycle, number>> = {
  Monthly: 1,
  Quarterly: 3,
  SemiAnnual: 6,
  Annual: 12,
};

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function periodDueDates(
  paymentCycle: PaymentCycle,
  startDate: string,
  endDate: string,
): string[] {
  if (!startDate || !endDate || startDate > endDate) return [];
  if (paymentCycle === "OneTime") return [endDate];
  if (paymentCycle === "Weekly") {
    const dueDates: string[] = [];
    const cursor = new Date(startDate);
    const end = new Date(endDate);
    cursor.setDate(cursor.getDate() + 6);
    while (cursor <= end) {
      dueDates.push(toIso(cursor));
      cursor.setDate(cursor.getDate() + 7);
    }
    return dueDates;
  }
  const step = monthsPerPeriod[paymentCycle] ?? 1;
  const dueDates: string[] = [];
  const cursor = new Date(startDate);
  const end = new Date(endDate);
  while (cursor <= end) {
    const due = endOfMonth(new Date(cursor.getFullYear(), cursor.getMonth() + step - 1, 1));
    dueDates.push(toIso(due > end ? end : due));
    cursor.setMonth(cursor.getMonth() + step);
  }
  return dueDates;
}

export function scheduledPaymentLabel(
  paymentCycle: PaymentCycle,
  cycleLabel: string,
  dueDate: string,
): string {
  if (paymentCycle !== "Monthly") return cycleLabel;
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(dueDate));
  return `${month} dues`;
}
