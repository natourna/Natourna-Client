import { useCallback, useMemo } from "react";
import { useAuth } from "./useAuth";
import { apartmentService, paymentService } from "../services";
import { todayIso } from "../utils/date";
import { paymentStatus } from "../utils/paymentStatus";
import { findApartmentForUser } from "./useResidentApartment";
import { useAsyncData } from "./useAsyncData";
import type { PaymentRow } from "./usePayments";

export function useResidentHome() {
  const { session } = useAuth();
  const username = session?.username ?? null;

  const loader = useCallback(async () => {
    if (!username) return null;
    const apartments = await apartmentService.getApartments();
    const apartment = findApartmentForUser(apartments, username);
    if (!apartment) return { apartment: null, payments: [] };
    const payments = await paymentService.getPaymentsByApartment(apartment.id);
    return { apartment, payments };
  }, [username]);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const home = useMemo(() => {
    if (!data) return null;
    const today = todayIso();
    const rows: PaymentRow[] = data.payments
      .map((payment) => ({
        payment,
        apartmentLabel: data.apartment?.apartmentInfo ?? "—",
        status: paymentStatus(payment, today),
      }))
      .sort((a, b) => b.payment.dueDate.localeCompare(a.payment.dueDate));
    const nextDue =
      rows
        .filter((row) => row.status !== "paid")
        .sort((a, b) => a.payment.dueDate.localeCompare(b.payment.dueDate))[0] ?? null;
    return { apartment: data.apartment, rows, nextDue };
  }, [data]);

  return { home, isLoading, error, reload };
}
