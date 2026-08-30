import { useCallback, useState } from "react";
import type { PagedResult } from "../types/paged";
import { useAsyncData } from "./useAsyncData";

const DEFAULT_PAGE_SIZE = 5;

export function usePagedData<T>(
  loader: (page: number, pageSize: number) => Promise<PagedResult<T>>,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const [page, setPage] = useState(1);

  const pagedLoader = useCallback(() => loader(page, pageSize), [loader, page, pageSize]);
  const { data, isLoading, error, reload } = useAsyncData(pagedLoader);

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    items: data?.items ?? null,
    page,
    setPage,
    pageSize,
    totalCount,
    totalPages,
    isLoading,
    error,
    reload,
  };
}
