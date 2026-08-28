import { useCallback, useMemo, useState } from "react";
import type { Apartment } from "../types/apartment";
import { apartmentService, paymentService } from "../services";
import { todayIso } from "../utils/date";
import { paymentStatus, type PaymentStatus } from "../utils/paymentStatus";
import { useAsyncData } from "./useAsyncData";

export interface ApartmentListItem {
  apartment: Apartment;
  status: PaymentStatus;
  outstanding: number;
}

export interface ApartmentGroup {
  buildingName: string;
  items: ApartmentListItem[];
}

export function apartmentStanding(
  payments: { isPaid: boolean; dueDate: string; amount: number }[],
  today: string,
): { status: PaymentStatus; outstanding: number } {
  const unpaid = payments.filter((payment) => !payment.isPaid);
  const outstanding = unpaid.reduce((sum, payment) => sum + payment.amount, 0);
  if (unpaid.some((payment) => paymentStatus(payment, today) === "overdue")) {
    return { status: "overdue", outstanding };
  }
  return { status: outstanding > 0 ? "due" : "paid", outstanding };
}

export function useApartments() {
  const [search, setSearch] = useState("");

  const loader = useCallback(async () => {
    const [apartments, payments] = await Promise.all([
      apartmentService.getApartments(),
      paymentService.getPayments(),
    ]);
    return { apartments, payments };
  }, []);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const groups = useMemo<ApartmentGroup[]>(() => {
    if (!data) return [];
    const today = todayIso();
    const query = search.trim().toLowerCase();
    const items = data.apartments
      .filter((apartment) =>
        query.length === 0
          ? true
          : [apartment.apartmentInfo, apartment.owner, apartment.tenant ?? ""]
              .join(" ")
              .toLowerCase()
              .includes(query),
      )
      .map((apartment) => ({
        apartment,
        ...apartmentStanding(
          data.payments.filter((payment) => payment.apartmentId === apartment.id),
          today,
        ),
      }));
    const buildingNames = [...new Set(items.map((item) => item.apartment.buildingName))];
    return buildingNames.map((buildingName) => ({
      buildingName,
      items: items.filter((item) => item.apartment.buildingName === buildingName),
    }));
  }, [data, search]);

  return {
    isLoading,
    error,
    reload,
    search,
    setSearch,
    groups,
    apartmentCount: data?.apartments.length ?? 0,
    buildingCount: new Set(data?.apartments.map((apartment) => apartment.buildingId)).size,
  };
}
