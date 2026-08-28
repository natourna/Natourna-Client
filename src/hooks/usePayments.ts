import { useCallback, useMemo, useState } from "react";
import type { Payment } from "../types/payment";
import { apartmentService, balanceService, paymentService } from "../services";
import { todayIso } from "../utils/date";
import { paymentStatus, type PaymentStatus } from "../utils/paymentStatus";
import { useAsyncData } from "./useAsyncData";
import { usePaymentActions } from "./usePaymentActions";

export type PaymentFilter = "all" | "due" | "paid" | "overdue";

export interface PaymentRow {
  payment: Payment;
  apartmentLabel: string;
  status: PaymentStatus;
}

const statusOrder: Record<PaymentStatus, number> = { overdue: 0, due: 1, paid: 2 };

function compareRows(a: PaymentRow, b: PaymentRow): number {
  if (a.status !== b.status) return statusOrder[a.status] - statusOrder[b.status];
  if (a.status === "paid") {
    return (b.payment.paymentDate ?? "").localeCompare(a.payment.paymentDate ?? "");
  }
  return a.payment.dueDate.localeCompare(b.payment.dueDate);
}

export function usePayments() {
  const [filter, setFilter] = useState<PaymentFilter>("all");

  const loader = useCallback(async () => {
    const [payments, apartments, balances] = await Promise.all([
      paymentService.getPayments(),
      apartmentService.getApartments(),
      balanceService.getBalances(),
    ]);
    return { payments, apartments, balances };
  }, []);

  const { data, isLoading, error, reload } = useAsyncData(loader);
  const actions = usePaymentActions(data?.balances ?? null, reload);

  const rows = useMemo<PaymentRow[]>(() => {
    if (!data) return [];
    const today = todayIso();
    return data.payments
      .map((payment) => ({
        payment,
        apartmentLabel:
          data.apartments.find((apartment) => apartment.id === payment.apartmentId)
            ?.apartmentInfo ?? "—",
        status: paymentStatus(payment, today),
      }))
      .sort(compareRows);
  }, [data]);

  const filteredRows = useMemo(
    () => rows.filter((row) => filter === "all" || row.status === filter),
    [rows, filter],
  );

  const countFor = (target: PaymentFilter) =>
    target === "all" ? rows.length : rows.filter((row) => row.status === target).length;

  return {
    isLoading,
    error,
    reload,
    filter,
    setFilter,
    filteredRows,
    countFor,
    ...actions,
  };
}
