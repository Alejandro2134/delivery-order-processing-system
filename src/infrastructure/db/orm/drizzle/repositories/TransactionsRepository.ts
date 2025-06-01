import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from "drizzle-orm/node-postgres";
import { db } from "..";
import { ITransactionsRepository } from "@/domain/repositories/ITransactionsRepository";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";

export class TransacionsRepository implements ITransactionsRepository {
  private db: NodePgDatabase;

  constructor() {
    this.db = db();
  }

  async runInTransaction<T>(
    fn: (
      tx?: PgTransaction<
        NodePgQueryResultHKT,
        Record<string, never>,
        ExtractTablesWithRelations<Record<string, never>>
      >
    ) => Promise<T>
  ): Promise<T> {
    return await this.db.transaction(async (tx) => {
      return await fn(tx);
    });
  }
}
