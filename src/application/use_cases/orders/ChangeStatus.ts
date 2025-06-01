import { Order } from "@/domain/entities/Order";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { ITransactionsRepository } from "@/domain/repositories/ITransactionsRepository";

export class ChangeStatus {
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

        const robotId = order.getRobotId();

        if (robotId) {
          const robot = await this.robotsRepository.getRobot(robotId, tx);
          if (!robot) throw new Error(`Robot with ID ${robotId} not found`);
          order.changeStatus(robot);
          await this.robotsRepository.updateRobot(robot, robotId, tx);
          return await this.ordersRepository.updateOrder(order, orderId, tx);
        } else {
          const robot = await this.robotsRepository.getAvailableRobot(tx);
          if (!robot) throw new Error(`No available robot found`);
          order.changeStatus(robot);
          await this.robotsRepository.updateRobot(robot, robot.getId(), tx);
          return await this.ordersRepository.updateOrder(order, orderId, tx);
        }
      }
    );
  }
}
