export interface PaginationInterface<T> {
  current_page: number,
  data: T,
  from: number,
  last_page: number,
  links: object[],
  per_page: number,
  to: number,
  total: number,
}
