import { useCallback, useMemo } from "react";
import { balanceService, billService, compoundService, paymentService } from "../services";
import { monthlyDues } from "../utils/monthlyDues";
import { useAsyncData } from "./useAsyncData";

const EXPENSES_LIMIT = 5;

export function useBuildingMoney() {
  const loader = useCallback(async () => {
    const [compound, balances, payments, bills] = await Promise.all([
      compoundService.getCompound(),
      balanceService.getBalances(),
      paymentService.getPayments(),
      billService.getBills(),
    ]);
    return { compound, balances, payments, bills };
  }, []);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const buildingMoney = useMemo(() => {
    if (!data) return null;
    return {
      compound: data.compound,
      balances: data.balances,
      totalFunds: data.balances.reduce((sum, balance) => sum + balance.currentAmount, 0),
      dues: monthlyDues(data.payments, new Date()),
      recentExpenses: data.bills
        .filter((bill) => bill.isPaid && bill.paymentDate)
        .sort((a, b) => (b.paymentDate ?? "").localeCompare(a.paymentDate ?? ""))
        .slice(0, EXPENSES_LIMIT),
    };
  }, [data]);

  return { buildingMoney, isLoading, error, reload };
}
