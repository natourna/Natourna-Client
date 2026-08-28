import { useCallback, useMemo, useState } from "react";
import type { Apartment } from "../types/apartment";
import { apartmentService, paymentService } from "../services";
import { todayIso } from "../utils/date";
import { paymentStatus, type PaymentStatus } from "../utils/paymentStatus";
import { useAsyncData } from "./useAsyncData";
import { useDebouncedValue } from "./useDebouncedValue";

export interface ApartmentListItem {
  apartment: Apartment;
  status: PaymentStatus;
  outstanding: number;
}

export interface ApartmentGroup {
  buildingName: string;
  items: ApartmentListItem[];
}

const PAGE_SIZE = 20;

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
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const loader = useCallback(async () => {
    const [apartments, unpaidPayments] = await Promise.all([
      apartmentService.getApartments({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch === "" ? undefined : debouncedSearch,
      }),
      paymentService.getAllPayments({ isPaid: false }),
    ]);
    return { apartments, unpaidPayments };
  }, [debouncedSearch, page]);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const groups = useMemo<ApartmentGroup[]>(() => {
    if (!data) return [];
    const today = todayIso();
    const items = data.apartments.items.map((apartment) => ({
      apartment,
      ...apartmentStanding(
        data.unpaidPayments.filter((payment) => payment.apartmentId === apartment.id),
        today,
      ),
    }));
    const buildingNames = [...new Set(items.map((item) => item.apartment.buildingName))];
    return buildingNames.map((buildingName) => ({
      buildingName,
      items: items.filter((item) => item.apartment.buildingName === buildingName),
    }));
  }, [data]);

  const setSearch = useCallback((next: string) => {
    setSearchState(next);
    setPage(1);
  }, []);

  return {
    isLoading,
    error,
    reload,
    search,
    setSearch,
    groups,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalCount: data?.apartments.totalCount ?? 0,
    apartmentCount: data?.apartments.totalCount ?? 0,
    buildingCount: new Set(data?.apartments.items.map((apartment) => apartment.buildingId)).size,
  };
}
