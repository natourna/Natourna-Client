import { useCallback, useEffect, useState } from "react";
import type { Apartment } from "../types/apartment";
import { apartmentService, buildingService, paymentService } from "../services";
import { todayIso } from "../utils/date";
import { paymentStatus, type PaymentStatus } from "../utils/paymentStatus";
import { useAsyncData } from "./useAsyncData";
import { useDebouncedValue } from "./useDebouncedValue";
import { usePagedData } from "./usePagedData";

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
  const debouncedSearch = useDebouncedValue(search.trim());

  const loader = useCallback(
    async (page: number, pageSize: number) => {
      const [apartments, payments] = await Promise.all([
        apartmentService.getApartmentsPage(page, pageSize, debouncedSearch),
        paymentService.getPayments(),
      ]);
      const today = todayIso();
      const items = apartments.items.map((apartment) => ({
        apartment,
        ...apartmentStanding(
          payments.filter((payment) => payment.apartmentId === apartment.id),
          today,
        ),
      }));
      const buildingNames = [...new Set(items.map((item) => item.apartment.buildingName))];
      const groups = buildingNames.map((buildingName) => ({
        buildingName,
        items: items.filter((item) => item.apartment.buildingName === buildingName),
      }));
      return { ...apartments, items: groups };
    },
    [debouncedSearch],
  );

  const { items, page, setPage, totalPages, totalCount, isLoading, error, reload } =
    usePagedData<ApartmentGroup>(loader);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, setPage]);

  const buildingsLoader = useCallback(() => buildingService.getBuildings(), []);
  const { data: buildings } = useAsyncData(buildingsLoader);

  return {
    isLoading,
    error,
    reload,
    search,
    setSearch,
    groups: items ?? [],
    page,
    setPage,
    totalPages,
    apartmentCount: totalCount,
    buildingCount: buildings?.length ?? 0,
  };
}
