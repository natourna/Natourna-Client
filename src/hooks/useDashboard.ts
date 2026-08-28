import { useCallback, useMemo } from "react";
import { apartmentService, balanceService, billService, compoundService, paymentService } from "../services";
import { todayIso } from "../utils/date";
import { monthlyDues } from "../utils/monthlyDues";
import { paymentStatus } from "../utils/paymentStatus";
import { useAsyncData } from "./useAsyncData";
import type { PaymentRow } from "./usePayments";

export function useDashboard() {
  const loader = useCallback(async () => {
    const [compound, balances, payments, bills, apartments] = await Promise.all([
      compoundService.getCompound(),
      balanceService.getBalances(),
      paymentService.getPayments(),
      billService.getBills(),
      apartmentService.getApartments(),
    ]);
    return { compound, balances, payments, bills, apartments };
  }, []);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const dashboard = useMemo(() => {
    if (!data) return null;
    const today = todayIso();

    const apartmentLabel = (apartmentId: string) =>
      data.apartments.find((apartment) => apartment.id === apartmentId)?.apartmentInfo ?? "—";

    const overdueRows: PaymentRow[] = data.payments
      .filter((payment) => paymentStatus(payment, today) === "overdue")
      .map((payment) => ({
        payment,
        apartmentLabel: apartmentLabel(payment.apartmentId),
        status: "overdue" as const,
      }))
      .sort((a, b) => a.payment.dueDate.localeCompare(b.payment.dueDate));

    const unpaidBills = data.bills
      .filter((bill) => !bill.isPaid)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    return {
      compound: data.compound,
      balances: data.balances,
      totalFunds: data.balances.reduce((sum, balance) => sum + balance.currentAmount, 0),
      overdueRows,
      unpaidBills,
      dues: monthlyDues(data.payments, new Date()),
    };
  }, [data]);

  return { dashboard, isLoading, error, reload };
}
