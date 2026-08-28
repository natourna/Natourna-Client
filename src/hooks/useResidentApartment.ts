import { useCallback } from "react";
import type { Apartment } from "../types/apartment";
import { useAuth } from "./useAuth";
import { apartmentService } from "../services";
import { useAsyncData } from "./useAsyncData";

export function findApartmentForUser(
  apartments: Apartment[],
  username: string,
): Apartment | null {
  return (
    apartments.find(
      (apartment) => apartment.owner === username || apartment.tenant === username,
    ) ?? null
  );
}

export function useResidentApartment() {
  const { session } = useAuth();
  const username = session?.username ?? null;

  const loader = useCallback(async () => {
    if (!username) return null;
    const apartments = await apartmentService.getAllApartments();
    return findApartmentForUser(apartments, username);
  }, [username]);

  const { data, isLoading, error, reload } = useAsyncData(loader);
  return { apartment: data, isLoading, error, reload };
}
