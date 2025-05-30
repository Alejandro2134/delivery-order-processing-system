import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { db } from "..";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Robot } from "@/domain/entities/Robot";
import { robotsTable } from "../schema/robot";
import { eq } from "drizzle-orm";

type RobotRow = {
  id: number;
  robotId: string;
  status: "available" | "busy" | "offline";
  lastKnownLocation: string;
};

export class RobotsRepository implements IRobotsRepository {
  private db: NodePgDatabase;

  constructor() {
    this.db = db();
  }

  async getAvailableRobot(): Promise<Robot | null> {
    const rows = await this.db
      .select()
      .from(robotsTable)
      .where(eq(robotsTable.status, "available"))
      .limit(1);
    if (rows.length === 0) return null;

    const row = rows[0];
    return this.mapRowToRobot(row);
  }

  async updateRobot(robot: Robot, id: number): Promise<Robot> {
    const updatedRobots = await this.db
      .update(robotsTable)
      .set({
        lastKnownLocation: robot.getLastKnownLocation(),
        status: robot.getStatus(),
      })
      .where(eq(robotsTable.id, id))
      .returning();

    if (updatedRobots.length === 0)
      throw new Error(`Robot with id ${id} not found`);

    const updatedRobot = updatedRobots[0];
    return this.mapRowToRobot(updatedRobot);
  }

  async getRobot(id: number): Promise<Robot | null> {
    const rows = await this.db
      .select()
      .from(robotsTable)
      .where(eq(robotsTable.id, id));

    if (rows.length === 0) return null;
    const row = rows[0];

    return this.mapRowToRobot(row);
  }

  async getRobots(): Promise<Robot[]> {
    const rows = await this.db
      .select()
      .from(robotsTable)
      .orderBy(robotsTable.id);

    return rows.map((row) => {
      const robot = this.mapRowToRobot(row);
      return robot;
    });
  }

  async createRobot(robot: Robot): Promise<Robot> {
    const createdRobots = await this.db
      .insert(robotsTable)
      .values({
        robotId: robot.getRobotId(),
        status: robot.getStatus(),
        lastKnownLocation: robot.getLastKnownLocation(),
      })
      .returning();

    const createdRobot = createdRobots[0];
    return this.mapRowToRobot(createdRobot);
  }

  mapRowToRobot(row: RobotRow): Robot {
    const robot = new Robot({ robotId: row.robotId });
    robot.setId(row.id);
    robot.setStatus(row.status);
    robot.setLastKnownLocation(row.lastKnownLocation);

    return robot;
  }
}
