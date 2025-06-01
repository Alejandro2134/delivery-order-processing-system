import { Robot, RobotStatus } from "@/domain/entities/Robot";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { ITransactionsRepository } from "@/domain/repositories/ITransactionsRepository";

const AVAILABLE_STATUS: RobotStatus[] = ["available", "busy", "offline"];

export class ChangeStatus {
  private readonly robotsRepository: IRobotsRepository;
  private readonly ordersRepository: IOrdersRepository;
  private readonly transactionsRepository: ITransactionsRepository;

  constructor(
    robotsRepository: IRobotsRepository,
    ordersRepository: IOrdersRepository,
    transactionsRepository: ITransactionsRepository
  ) {
    this.robotsRepository = robotsRepository;
    this.ordersRepository = ordersRepository;
    this.transactionsRepository = transactionsRepository;
  }

  async execute(id: number, newStatus: string) {
    return await this.transactionsRepository.runInTransaction<Robot>(
      async (tx) => {
        const status = newStatus as RobotStatus;

        if (!AVAILABLE_STATUS.includes(status))
          throw new Error(`Invalid status: ${newStatus}`);

        const robot = await this.robotsRepository.getRobot(id, tx);
        if (!robot) throw new Error(`Robot with id ${id} not found`);

        if (status === "busy") {
          robot.changeStatus(status);
          const order = await this.ordersRepository.getPendingOrder(tx);
          if (!order) throw new Error("No pending orders available");

          order.setRobotId(robot.getId());
          order.setStatus("assigned");
          await this.ordersRepository.updateOrder(order, order.getId(), tx);
          return await this.robotsRepository.updateRobot(robot, id, tx);
        } else {
          robot.changeStatus(status);
          return await this.robotsRepository.updateRobot(robot, id, tx);
        }
      }
    );
  }
}
