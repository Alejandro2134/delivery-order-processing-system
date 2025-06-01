import { Robot } from "@/domain/entities/Robot";
import { CommonOperations } from "./interfaces/CommonOperations";
import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { GetRobots } from "@/application/use_cases/robots/GetRobots";
import { CreateRobot } from "@/application/use_cases/robots/CreateRobot";
import { GenerateUUID } from "@/infrastructure/utils/generateUUID";
import { ChangeStatus } from "@/application/use_cases/robots/ChangeStatus";
import { RobotAPI, robotSchema } from "../validators/robot.schema";

export class RobotsController implements CommonOperations<Robot, undefined> {
  private robotsRepository: IRobotsRepository;

  constructor(robotsRepository: IRobotsRepository) {
    this.robotsRepository = robotsRepository;
  }

  changeStatus(id: number, newStatus: RobotAPI) {
    const validatedItem = robotSchema.parse(newStatus);
    const changeStatus = new ChangeStatus(this.robotsRepository);
    return changeStatus.execute(id, validatedItem.status);
  }

  list(): Promise<Robot[]> {
    const getRobots = new GetRobots(this.robotsRepository);
    return getRobots.execute();
  }

  create(): Promise<Robot> {
    const generateUUID = new GenerateUUID();
    const createRobot = new CreateRobot(this.robotsRepository, generateUUID);

    return createRobot.execute();
  }
}
