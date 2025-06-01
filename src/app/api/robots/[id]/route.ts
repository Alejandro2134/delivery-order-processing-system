import { RobotsController } from "@/adapters/controllers/RobotsController";
import { RobotAPI } from "@/adapters/validators/robot.schema";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";
import { z } from "zod";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body: RobotAPI = await request.json();
    const robotId = parseInt(id, 10);
    const robotsRepository = new RobotsRepository();
    const robotsController = new RobotsController(robotsRepository);
    const robot = await robotsController.changeStatus(robotId, body);
    return Response.json(robot, { status: 200 });
  } catch (err: unknown) {
    let errorMessage: string = "Unexpected Error";
    let zodIssues: z.ZodIssue[] = [];
    let statusCode = 500;

    if (err instanceof z.ZodError) {
      errorMessage = "Validation Error";
      statusCode = 400;
      zodIssues = err.issues;
    } else if (err instanceof Error) {
      errorMessage = err.message;
      statusCode = 400;
    }

    return Response.json(
      { error: errorMessage, issues: zodIssues },
      { status: statusCode }
    );
  }
}
