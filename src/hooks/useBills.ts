import { useCallback, useMemo, useState } from "react";
import type { Bill } from "../types/bill";
import { balanceService, billService, toErrorMessage } from "../services";
import { formatCurrency } from "../utils/currency";
import { todayIso } from "../utils/date";
import { paymentStatus, type PaymentStatus } from "../utils/paymentStatus";
import { useAsyncData } from "./useAsyncData";

export interface BillRow {
  bill: Bill;
  status: PaymentStatus;
  remainingAfter: number | null;
}

const PAGE_SIZE = 20;

const statusOrder: Record<PaymentStatus, number> = { overdue: 0, due: 1, paid: 2 };

export function useBills() {
  const [page, setPage] = useState(1);

  const loader = useCallback(async () => {
    const [bills, balances] = await Promise.all([
      billService.getBills({ page, pageSize: PAGE_SIZE }),
      balanceService.getBalances(),
    ]);
    return { bills, balances };
  }, [page]);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const [pendingBill, setPendingBill] = useState<Bill | null>(null);
  const [isMarking, setIsMarking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const rows = useMemo<BillRow[]>(() => {
    if (!data) return [];
    const today = todayIso();
    return data.bills.items
      .map((bill) => {
        const balance = data.balances.find((candidate) => candidate.id === bill.balanceId);
        return {
          bill,
          status: paymentStatus(bill, today),
          remainingAfter:
            !bill.isPaid && balance ? balance.currentAmount - bill.amount : null,
        };
      })
      .sort((a, b) => {
        if (a.status !== b.status) return statusOrder[a.status] - statusOrder[b.status];
        if (a.status === "paid") {
          return (b.bill.paymentDate ?? "").localeCompare(a.bill.paymentDate ?? "");
        }
        return a.bill.dueDate.localeCompare(b.bill.dueDate);
      });
  }, [data]);

  const requestMarkAsPaid = (bill: Bill) => {
    setToastMessage(null);
    setActionError(null);
    setPendingBill(bill);
  };

  const confirmMarkAsPaid = async () => {
    if (!pendingBill) return;
    setIsMarking(true);
    try {
      await billService.markBillAsPaid(pendingBill.id);
      setToastMessage(
        `Done — ${pendingBill.label} paid: ${formatCurrency(pendingBill.amount)} taken from the ${pendingBill.balanceName}.`,
      );
      setPendingBill(null);
      reload();
    } catch (cause) {
      setActionError(toErrorMessage(cause));
      setPendingBill(null);
    } finally {
      setIsMarking(false);
    }
  };

  return {
    rows,
    isLoading,
    error,
    reload,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalCount: data?.bills.totalCount ?? 0,
    isConfirmOpen: pendingBill !== null,
    isMarking,
    confirmTitle: pendingBill
      ? `Mark "${pendingBill.label}" (${formatCurrency(pendingBill.amount)}) as paid?`
      : "",
    confirmSubtitle: pendingBill
      ? `This takes ${formatCurrency(pendingBill.amount)} from the ${pendingBill.balanceName}.`
      : "",
    toastMessage,
    actionError,
    requestMarkAsPaid,
    cancelMarkAsPaid: () => setPendingBill(null),
    confirmMarkAsPaid,
    dismissToast: () => setToastMessage(null),
  };
}
