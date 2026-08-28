import type { Paged } from "../../types/paging";

const FULL_FETCH_PAGE_SIZE = 100;

export async function fetchAllPages<T>(
  fetchPage: (page: number, pageSize: number) => Promise<Paged<T>>,
): Promise<T[]> {
  const first = await fetchPage(1, FULL_FETCH_PAGE_SIZE);
  const items = [...first.items];
  const totalPages = Math.ceil(first.totalCount / first.pageSize);
  for (let page = 2; page <= totalPages; page += 1) {
    const next = await fetchPage(page, FULL_FETCH_PAGE_SIZE);
    items.push(...next.items);
  }
  return items;
}
