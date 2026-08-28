export interface Paged<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface PageParams {
  page: number;
  pageSize: number;
}
