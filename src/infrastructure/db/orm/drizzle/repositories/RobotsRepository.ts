import { IRobotsRepository } from "@/domain/repositories/IRobotsRepository";
import { db } from "..";
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from "drizzle-orm/node-postgres";
import { IRobotFilter, Robot } from "@/domain/entities/Robot";
import { robotsTable } from "../schema/robot";
import { eq, ExtractTablesWithRelations, and, ilike } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

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

  async getAvailableRobot(
    tx?: PgTransaction<
      NodePgQueryResultHKT,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >
  ): Promise<Robot | null> {
    const exec = tx ?? this.db;

    const rows = await exec
      .select()
      .from(robotsTable)
      .where(eq(robotsTable.status, "available"))
      .limit(1)
      .for("update", { skipLocked: true });

    if (rows.length === 0) return null;

    const row = rows[0];
    return this.mapRowToRobot(row);
  }

  async updateRobot(
    robot: Robot,
    id: number,
    tx?: PgTransaction<
      NodePgQueryResultHKT,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >
  ): Promise<Robot> {
    const exec = tx ?? this.db;

    const updatedRobots = await exec
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

  async getRobot(
    id: number,
    tx?: PgTransaction<
      NodePgQueryResultHKT,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >
  ): Promise<Robot | null> {
    const exec = tx ?? this.db;

    const rows = await exec
      .select()
      .from(robotsTable)
      .where(eq(robotsTable.id, id))
      .for("update");

    if (rows.length === 0) return null;
    const row = rows[0];

    return this.mapRowToRobot(row);
  }

  async getRobots(filter: IRobotFilter): Promise<Robot[]> {
    const whereClauses = [];

    if (filter.lastKnownLocation)
      whereClauses.push(
        ilike(robotsTable.lastKnownLocation, `${filter.lastKnownLocation}`)
      );
    if (filter.robot)
      whereClauses.push(ilike(robotsTable.robotId, `${filter.robot}`));
    if (filter.status) whereClauses.push(eq(robotsTable.status, filter.status));

    const rows = await this.db
      .select()
      .from(robotsTable)
      .where(and(...whereClauses))
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
