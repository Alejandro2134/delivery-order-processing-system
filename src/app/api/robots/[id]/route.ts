import { RobotsController } from "@/adapters/controllers/RobotsController";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { status } = await request.json();
  const robotId = parseInt(context.params.id, 10);
  const robotsRepository = new RobotsRepository();
  const robotsController = new RobotsController(robotsRepository);
  const robot = await robotsController.changeStatus(robotId, status || "");
  return Response.json(robot, { status: 200 });
}
