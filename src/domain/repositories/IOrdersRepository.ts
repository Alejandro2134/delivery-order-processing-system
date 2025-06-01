import { Order } from "@/domain/entities/Order";

export interface IOrdersRepository {
  getOrders(): Promise<Order[]>;
  createOrder(order: Order): Promise<Order>;
  getOrder(id: number, tx?: unknown): Promise<Order | null>;
  updateOrder(order: Order, id: number, tx?: unknown): Promise<Order>;
}
