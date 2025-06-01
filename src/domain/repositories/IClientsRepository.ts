import { Client } from "@/domain/entities/Client";

export interface IClientsRepository {
  getClient(id: number): Promise<Client | null>;
}
