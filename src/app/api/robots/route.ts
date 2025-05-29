import { RobotsController } from "@/adapters/controllers/RobotsController";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";

export async function GET() {
  try {
    const robotsRepository = new RobotsRepository();
    const robotsController = new RobotsController(robotsRepository);
    const robots = await robotsController.list();
    return Response.json(robots, { status: 200 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected Error";
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}

export async function POST() {
  try {
    const robotsRepository = new RobotsRepository();
    const robotsController = new RobotsController(robotsRepository);
    const robot = await robotsController.create();
    return Response.json(robot, { status: 201 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected Error";
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}
