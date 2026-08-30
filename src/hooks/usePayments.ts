import { useCallback, useEffect, useState } from "react";
import type { Payment } from "../types/payment";
import type { PaymentListFilters } from "../services/paymentService";
import { balanceService, paymentService } from "../services";
import { todayIso } from "../utils/date";
import { paymentStatus, type PaymentStatus } from "../utils/paymentStatus";
import { useAsyncData } from "./useAsyncData";
import { usePagedData } from "./usePagedData";
import { usePaymentActions } from "./usePaymentActions";

export type PaymentFilter = "all" | "due" | "paid" | "overdue";

export interface PaymentRow {
  payment: Payment;
  apartmentLabel: string;
  status: PaymentStatus;
}

const filterParams: Record<PaymentFilter, PaymentListFilters> = {
  all: {},
  due: { isPaid: false, overdue: false },
  paid: { isPaid: true },
  overdue: { overdue: true },
};

export function usePayments() {
  const [filter, setFilter] = useState<PaymentFilter>("all");

  const loader = useCallback(
    async (page: number, pageSize: number) => {
      const payments = await paymentService.getPaymentsPage(page, pageSize, filterParams[filter]);
      const today = todayIso();
      const items = payments.items.map((payment) => ({
        payment,
        apartmentLabel: payment.apartmentInfo || "—",
        status: paymentStatus(payment, today),
      }));
      return { ...payments, items };
    },
    [filter],
  );

  const { items, page, setPage, totalPages, isLoading, error, reload } = usePagedData<PaymentRow>(loader);

  useEffect(() => {
    setPage(1);
  }, [filter, setPage]);

  const balancesLoader = useCallback(() => balanceService.getBalances(), []);
  const { data: balances } = useAsyncData(balancesLoader);
  const actions = usePaymentActions(balances, reload);

  return {
    isLoading,
    error,
    reload,
    filter,
    setFilter,
    rows: items ?? [],
    page,
    setPage,
    totalPages,
    ...actions,
  };
}
