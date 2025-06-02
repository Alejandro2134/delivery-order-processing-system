import { IOrderFilter, Order } from "@/domain/entities/Order";

export interface IOrdersRepository {
  getOrders(filter: IOrderFilter): Promise<Order[]>;
  createOrder(order: Order): Promise<Order>;
  getOrder(id: number, tx?: unknown): Promise<Order | null>;
  updateOrder(order: Order, id: number, tx?: unknown): Promise<Order>;
  getPendingOrder(tx?: unknown): Promise<Order | null>;
}
