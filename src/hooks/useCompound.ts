import { useCallback } from "react";
import { compoundService } from "../services";
import { useAsyncData } from "./useAsyncData";

export function useCompound() {
  const loader = useCallback(() => compoundService.getCompound(), []);
  const { data, isLoading, error, reload } = useAsyncData(loader);
  return { compound: data, isLoading, error, reload };
}
