import { Order } from "@/domain/entities/Order";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";

export class GetOrders {
  private readonly ordersRepository: IOrdersRepository;

  constructor(ordersRepository: IOrdersRepository) {
    this.ordersRepository = ordersRepository;
  }

  async execute(): Promise<Order[]> {
    return await this.ordersRepository.getOrders();
  }
}
