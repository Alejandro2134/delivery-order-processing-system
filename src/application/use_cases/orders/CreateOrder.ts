import { Order } from "@/domain/entities/Order";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";

export class CreateOrder {
  private readonly ordersRepository: IOrdersRepository;

  constructor(ordersRepository: IOrdersRepository) {
    this.ordersRepository = ordersRepository;
  }

  async execute(order: Order): Promise<Order> {
    return await this.ordersRepository.createOrder(order);
  }
}
