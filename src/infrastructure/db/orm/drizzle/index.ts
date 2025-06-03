import "../../../../../envConfig";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let dbInstance: NodePgDatabase | null = null;

export const db = () => {
  try {
    if (!dbInstance) {
      const url = process.env.DATABASE_URL;
      if (!url) throw new Error("DATABASE_URL not defined");

      const pool = new Pool({ connectionString: url });
      dbInstance = drizzle(pool);
    }

    return dbInstance;
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error");
  }
};
