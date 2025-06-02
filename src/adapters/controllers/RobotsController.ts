import { Robot } from "@/domain/entities/Robot";
import { CommonOperations } from "./interfaces/CommonOperations";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { GetRobots } from "@/application/use_cases/robots/GetRobots";
import { CreateRobot } from "@/application/use_cases/robots/CreateRobot";
import { GenerateUUID } from "@/infrastructure/utils/generateUUID";
import { ChangeStatus } from "@/application/use_cases/robots/ChangeStatus";
import {
  RobotAPI,
  RobotAPIFilter,
  robotFilterSchema,
  robotSchema,
} from "../validators/robot.schema";
import { IOrdersRepository } from "@/domain/repositories/IOrdersRepository";
import { ITransactionsRepository } from "@/domain/repositories/ITransactionsRepository";

export class RobotsController
  implements CommonOperations<Robot, undefined, RobotAPIFilter>
{
  private robotsRepository: IRobotsRepository;
  private ordersRepository: IOrdersRepository;
  private transactionsRepository: ITransactionsRepository;

  constructor(
    robotsRepository: IRobotsRepository,
    ordersRepository: IOrdersRepository,
    transactionsRepository: ITransactionsRepository
  ) {
    this.robotsRepository = robotsRepository;
    this.ordersRepository = ordersRepository;
    this.transactionsRepository = transactionsRepository;
  }

  changeStatus(id: number, newStatus: RobotAPI) {
    const validatedItem = robotSchema.parse(newStatus);
    const changeStatus = new ChangeStatus(
      this.robotsRepository,
      this.ordersRepository,
      this.transactionsRepository
    );
    return changeStatus.execute(id, validatedItem.status);
  }

  list(filter: RobotAPIFilter): Promise<Robot[]> {
    const validatedFilter = robotFilterSchema.parse(filter);
    const getRobots = new GetRobots(this.robotsRepository);
    return getRobots.execute(validatedFilter);
  }

  create(): Promise<Robot> {
    const generateUUID = new GenerateUUID();
    const createRobot = new CreateRobot(this.robotsRepository, generateUUID);

    return createRobot.execute();
  }
}
