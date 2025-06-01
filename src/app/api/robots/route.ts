import { RobotsController } from "@/adapters/controllers/RobotsController";
import { OrdersRepository } from "@/infrastructure/db/orm/drizzle/repositories/OrdersRepository";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";
import { TransacionsRepository } from "@/infrastructure/db/orm/drizzle/repositories/TransactionsRepository";

export async function GET() {
  try {
    const robotsRepository = new RobotsRepository();
    const ordersRepository = new OrdersRepository();
    const transactionsRepository = new TransacionsRepository();
    const robotsController = new RobotsController(
      robotsRepository,
      ordersRepository,
      transactionsRepository
    );
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
