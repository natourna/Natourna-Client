import { useCallback, useMemo, useState } from "react";
import type { Payment } from "../types/payment";
import { balanceService, paymentService } from "../services";
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

const PAGE_SIZE = 20;

function filterParams(filter: PaymentFilter): { isPaid?: boolean; dueBefore?: string } {
  switch (filter) {
    case "due":
      return { isPaid: false };
    case "paid":
      return { isPaid: true };
    case "overdue":
      return { isPaid: false, dueBefore: todayIso() };
    default:
      return {};
  }
}

export function usePayments() {
  const [filter, setFilterState] = useState<PaymentFilter>("all");
  const [page, setPage] = useState(1);

  const loader = useCallback(async () => {
    const [payments, balances] = await Promise.all([
      paymentService.getPayments({ page, pageSize: PAGE_SIZE, ...filterParams(filter) }),
      balanceService.getBalances(),
    ]);
    return { payments, balances };
  }, [filter, page]);

  const { data, isLoading, error, reload } = useAsyncData(loader);
  const actions = usePaymentActions(data?.balances ?? null, reload);

  const rows = useMemo<PaymentRow[]>(() => {
    if (!data) return [];
    const today = todayIso();
    return data.payments.items.map((payment) => ({
      payment,
      apartmentLabel: payment.apartmentInfo,
      status: paymentStatus(payment, today),
    }));
  }, [data]);

  const setFilter = useCallback((next: PaymentFilter) => {
    setFilterState(next);
    setPage(1);
  }, []);

  return {
    isLoading,
    error,
    reload,
    filter,
    setFilter,
    rows,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalCount: data?.payments.totalCount ?? 0,
    ...actions,
  };
}
