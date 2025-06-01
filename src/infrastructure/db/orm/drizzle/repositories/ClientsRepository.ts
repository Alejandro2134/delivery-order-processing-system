import { Client } from "@/domain/entities/Client";
import { IClientsRepository } from "@/domain/repositories/IClientsRepository";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "..";
import { clientsTable } from "../schema/client";
import { eq } from "drizzle-orm";

type ClientRow = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};

export class ClientsRepository implements IClientsRepository {
  private db: NodePgDatabase;

  constructor() {
    this.db = db();
  }

  async getClient(id: number): Promise<Client | null> {
    const rows = await this.db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.id, id));

    if (rows.length === 0) return null;
    const row = rows[0];

    return this.mapRowToClient(row);
  }

  mapRowToClient(row: ClientRow) {
    const client = new Client({
      address: row.address,
      firstName: row.firstName,
      lastName: row.lastName,
      phoneNumber: row.phoneNumber,
    });

    return client;
  }
}
