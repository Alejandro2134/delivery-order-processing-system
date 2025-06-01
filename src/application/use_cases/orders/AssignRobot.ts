import { Order } from "@/domain/entities/Order";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { ITransactionsRepository } from "@/domain/repositories/ITransactionsRepository";

export class AssignRobot {
  private readonly ordersRepository: IOrdersRepository;
  private readonly robotsRepository: IRobotsRepository;
  private readonly transactionsRepository: ITransactionsRepository;

  constructor(
    ordersRepository: IOrdersRepository,
    robotsRepository: IRobotsRepository,
    transactionsRepository: ITransactionsRepository
  ) {
    this.ordersRepository = ordersRepository;
    this.robotsRepository = robotsRepository;
    this.transactionsRepository = transactionsRepository;
  }

  async execute(orderId: number) {
    return await this.transactionsRepository.runInTransaction<Order>(
      async (tx) => {
        const order = await this.ordersRepository.getOrder(orderId, tx);
        if (!order) throw new Error(`Order with ID ${orderId} not found`);

        if (order.getStatus() !== "pending")
          throw new Error(`Order with ID ${orderId} is not in a pending state`);

        const robot = await this.robotsRepository.getAvailableRobot(tx);
        if (!robot) throw new Error(`No available robot found`);

        order.changeStatus(robot);

        await this.robotsRepository.updateRobot(robot, robot.getId(), tx);
        return await this.ordersRepository.updateOrder(order, orderId, tx);
      }
    );
  }
}
