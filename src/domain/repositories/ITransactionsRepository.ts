export interface ITransactionsRepository {
  runInTransaction<T>(fn: (tx?: unknown) => Promise<T>): Promise<T>;
}
