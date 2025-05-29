import { RobotsController } from "@/adapters/controllers/RobotsController";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status } = await request.json();
    const robotId = parseInt(id, 10);
    const robotsRepository = new RobotsRepository();
    const robotsController = new RobotsController(robotsRepository);
    const robot = await robotsController.changeStatus(robotId, status || "");
    return Response.json(robot, { status: 200 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected Error";
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}
