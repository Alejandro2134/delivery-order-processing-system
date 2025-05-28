import { RobotsController } from "@/adapters/controllers/RobotsController";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";

export async function GET() {
  const robotsRepository = new RobotsRepository();
  const robotsController = new RobotsController(robotsRepository);
  const robots = await robotsController.list();
  return Response.json(robots, { status: 200 });
}

export async function POST() {
  const robotsRepository = new RobotsRepository();
  const robotsController = new RobotsController(robotsRepository);
  const robot = await robotsController.create();
  return Response.json(robot, { status: 201 });
}
