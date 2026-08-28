import { useCallback, useMemo } from "react";
import { apartmentService, balanceService, paymentService } from "../services";
import { todayIso } from "../utils/date";
import { paymentStatus } from "../utils/paymentStatus";
import { apartmentStanding } from "./useApartments";
import { useAsyncData } from "./useAsyncData";
import { usePaymentActions } from "./usePaymentActions";
import type { PaymentRow } from "./usePayments";

export function useApartmentDetail(apartmentId: string) {
  const loader = useCallback(async () => {
    const [apartment, payments, balances] = await Promise.all([
      apartmentService.getApartmentById(apartmentId),
      paymentService.getPaymentsByApartment(apartmentId),
      balanceService.getBalances(),
    ]);
    return { apartment, payments, balances };
  }, [apartmentId]);

  const { data, isLoading, error, reload } = useAsyncData(loader);
  const actions = usePaymentActions(data?.balances ?? null, reload);

  const derived = useMemo(() => {
    if (!data) return null;
    const today = todayIso();
    const rows: PaymentRow[] = data.payments
      .map((payment) => ({
        payment,
        apartmentLabel: data.apartment.apartmentInfo,
        status: paymentStatus(payment, today),
      }))
      .sort((a, b) => b.payment.dueDate.localeCompare(a.payment.dueDate));
    return {
      apartment: data.apartment,
      rows,
      ...apartmentStanding(data.payments, today),
    };
  }, [data]);

  return { detail: derived, isLoading, error, reload, ...actions };
}
