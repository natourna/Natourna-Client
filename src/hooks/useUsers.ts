import { useCallback, useMemo, useState } from "react";
import type { User } from "../types/user";
import { apartmentService, toErrorMessage, userService } from "../services";
import { nameFromEmail } from "../utils/names";
import { useAsyncData } from "./useAsyncData";

export interface UserRow {
  user: User;
  displayName: string;
  apartmentLabel: string | null;
}

export function useUsers() {
  const loader = useCallback(async () => {
    const [users, apartments] = await Promise.all([
      userService.getUsers(),
      apartmentService.getApartments(),
    ]);
    return { users, apartments };
  }, []);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const rows = useMemo<UserRow[]>(() => {
    if (!data) return [];
    return data.users.map((user) => {
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
