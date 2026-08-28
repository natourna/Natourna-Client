import { useCallback, useMemo } from "react";
import type { Balance } from "../types/balance";
import { apartmentService, balanceService, billService, paymentService } from "../services";
import { useAsyncData } from "./useAsyncData";

export interface FundActivityEntry {
  id: string;
  label: string;
  date: string;
  amount: number;
  direction: "in" | "out";
}

export interface FundView {
  balance: Balance;
  activity: FundActivityEntry[];
}

const ACTIVITY_LIMIT = 5;

export function useFunds() {
  const loader = useCallback(async () => {
    const [balances, payments, bills, apartments] = await Promise.all([
      balanceService.getBalances(),
      paymentService.getPayments(),
      billService.getBills(),
      apartmentService.getApartments(),
    ]);
    return { balances, payments, bills, apartments };
  }, []);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const funds = useMemo<FundView[]>(() => {
    if (!data) return [];
    const apartmentLabel = (apartmentId: string) =>
      data.apartments.find((apartment) => apartment.id === apartmentId)?.apartmentInfo ?? "—";

    return data.balances.map((balance) => {
      const incoming: FundActivityEntry[] = data.payments
        .filter((payment) => payment.isPaid && payment.paymentDate)
        .flatMap((payment) =>
          payment.allocations
            .filter((allocation) => allocation.balanceId === balance.id)
            .map((allocation) => ({
              id: `${payment.id}-${balance.id}`,
              label: `${apartmentLabel(payment.apartmentId)} ${payment.label}`,
              date: payment.paymentDate ?? "",
              amount: allocation.allocatedAmount,
              direction: "in" as const,
            })),
        );
      const outgoing: FundActivityEntry[] = data.bills
        .filter((bill) => bill.isPaid && bill.paymentDate && bill.balanceId === balance.id)
        .map((bill) => ({
          id: bill.id,
          label: bill.label,
          date: bill.paymentDate ?? "",
          amount: bill.amount,
          direction: "out" as const,
        }));
      return {
        balance,
        activity: [...incoming, ...outgoing]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, ACTIVITY_LIMIT),
      };
    });
  }, [data]);

  const totalFunds = useMemo(
    () => (data?.balances ?? []).reduce((sum, balance) => sum + balance.currentAmount, 0),
    [data],
  );

  return { funds, totalFunds, isLoading, error, reload };
}
