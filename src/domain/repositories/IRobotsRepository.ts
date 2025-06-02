import { IRobotFilter, Robot } from "@/domain/entities/Robot";

export interface IRobotsRepository {
  getRobots(filter: IRobotFilter): Promise<Robot[]>;
  createRobot(robot: Robot): Promise<Robot>;
  getRobot(id: number, tx?: unknown): Promise<Robot | null>;
  updateRobot(robot: Robot, id: number, tx?: unknown): Promise<Robot>;
  getAvailableRobot(tx?: unknown): Promise<Robot | null>;
}
