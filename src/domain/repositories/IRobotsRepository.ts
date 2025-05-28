import { Robot } from "@/domain/entities/Robot";

export interface IRobotsRepository {
  getRobots(): Promise<Robot[]>;
  createRobot(robot: Robot): Promise<Robot>;
  getRobot(id: number): Promise<Robot | null>;
  updateRobot(robot: Robot, id: number): Promise<Robot>;
  getAvailableRobot(): Promise<Robot | null>;
}
