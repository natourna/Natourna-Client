const FULL_FETCH_PAGE_SIZE = 100;

interface Page<T> {
  items: T[];
  totalCount: number;
}

export async function fetchAllPages<T>(fetchPage: (page: number, pageSize: number) => Promise<Page<T>>): Promise<T[]> {
  const first = await fetchPage(1, FULL_FETCH_PAGE_SIZE);
  const all = [...first.items];

  let page = 1;
  while (all.length < first.totalCount) {
    page += 1;
    const next = await fetchPage(page, FULL_FETCH_PAGE_SIZE);
    if (next.items.length === 0) break;
    all.push(...next.items);
  }

  return all;
}
