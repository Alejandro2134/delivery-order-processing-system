import { RobotsController } from "@/adapters/controllers/RobotsController";
import { OrdersRepository } from "@/infrastructure/db/orm/drizzle/repositories/OrdersRepository";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";
import { TransacionsRepository } from "@/infrastructure/db/orm/drizzle/repositories/TransactionsRepository";

type RobotStatus = "offline" | "busy" | "available";

export async function GET(request: Request) {
  try {
    const robotsRepository = new RobotsRepository();
    const ordersRepository = new OrdersRepository();
    const transactionsRepository = new TransacionsRepository();
    const robotsController = new RobotsController(
      robotsRepository,
      ordersRepository,
      transactionsRepository
    );

    const { searchParams } = new URL(request.url);
    const robots = await robotsController.list({
      lastKnownLocation: searchParams.get("lastKnownLocation") || undefined,
      robot: searchParams.get("robot") || undefined,
      status: (searchParams.get("status") as RobotStatus) || undefined,
    });
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
    const ordersRepository = new OrdersRepository();
    const transactionsRepository = new TransacionsRepository();
    const robotsController = new RobotsController(
      robotsRepository,
      ordersRepository,
      transactionsRepository
    );
    const robot = await robotsController.create();
    return Response.json(robot, { status: 201 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected Error";
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}
