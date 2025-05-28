export interface CommonOperations<T, TAPI> {
  list(): Promise<T[]>;
  create(item: TAPI): Promise<T>;
}
