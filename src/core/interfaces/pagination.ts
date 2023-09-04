export interface Pagination<T> {
  data: T[];
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
