import { useCallback, useMemo, useState } from "react";
import type { User } from "../types/user";
import { apartmentService, toErrorMessage, userService } from "../services";
import { nameFromEmail } from "../utils/names";
import { useAsyncData } from "./useAsyncData";
import { useDebouncedValue } from "./useDebouncedValue";

export interface UserRow {
  user: User;
  displayName: string;
  apartmentLabel: string | null;
}

const PAGE_SIZE = 20;

export function useUsers() {
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const loader = useCallback(async () => {
    const [users, apartments] = await Promise.all([
      userService.getUsers({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch === "" ? undefined : debouncedSearch,
      }),
      apartmentService.getAllApartments(),
    ]);
    return { users, apartments };
  }, [debouncedSearch, page]);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const rows = useMemo<UserRow[]>(() => {
    if (!data) return [];
    return data.users.items.map((user) => {
      const displayName = nameFromEmail(user.email);
      const owned = data.apartments.find((apartment) => apartment.owner === displayName);
      const rented = data.apartments.find((apartment) => apartment.tenant === displayName);
      return {
        user,
        displayName,
        apartmentLabel: owned
          ? owned.apartmentInfo
          : rented
            ? `${rented.apartmentInfo} (tenant)`
            : null,
      };
    });
  }, [data]);

  const setSearch = useCallback((next: string) => {
    setSearchState(next);
    setPage(1);
  }, []);

  const requestToggleActive = (user: User) => {
    setActionError(null);
    setPendingUser(user);
  };

  const confirmToggleActive = async () => {
    if (!pendingUser) return;
    setIsSaving(true);
    try {
      await userService.setUserActive(pendingUser.id, !pendingUser.isActive);
      setPendingUser(null);
      reload();
    } catch (cause) {
      setActionError(toErrorMessage(cause));
      setPendingUser(null);
    } finally {
      setIsSaving(false);
    }
  };

  const pendingName = pendingUser ? nameFromEmail(pendingUser.email) : "";

  return {
    rows,
    isLoading,
    error,
    reload,
    search,
    setSearch,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalCount: data?.users.totalCount ?? 0,
    isConfirmOpen: pendingUser !== null,
    isSaving,
    confirmTitle: pendingUser
      ? `${pendingUser.isActive ? "Deactivate" : "Reactivate"} ${pendingName}?`
      : "",
    confirmSubtitle: pendingUser
      ? pendingUser.isActive
        ? `${pendingName} will no longer be able to sign in.`
        : `${pendingName} will be able to sign in again.`
      : "",
    confirmLabel: pendingUser
      ? pendingUser.isActive
        ? "Yes, deactivate"
        : "Yes, reactivate"
      : "",
    actionError,
    requestToggleActive,
    cancelToggleActive: () => setPendingUser(null),
    confirmToggleActive,
  };
}
