import "../../../../../envConfig";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let dbInstance: NodePgDatabase | null = null;

export const db = () => {
  if (!dbInstance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL not defined");

    const pool = new Pool({ connectionString: url });
    dbInstance = drizzle(pool);
  }

  return dbInstance;
};
