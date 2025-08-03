export interface PaginatedResult<T> {
  data: T[];
  count: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  where?: any;
  orderBy?: any;
  include?: any;
  select?: any;
}
