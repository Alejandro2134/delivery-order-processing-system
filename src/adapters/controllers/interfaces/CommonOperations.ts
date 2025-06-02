export interface CommonOperations<T, TAPI, TAPIFilter> {
  list(filter: TAPIFilter): Promise<T[]>;
  create(item: TAPI): Promise<T>;
}
