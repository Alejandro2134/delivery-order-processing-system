import { OrdersController } from "@/adapters/controllers/OrdersController";
import { OrdersRepository } from "@/infrastructure/db/orm/drizzle/repositories/OrdersRepository";
import { RobotsRepository } from "@/infrastructure/db/orm/drizzle/repositories/RobotsRepository";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const orderId = parseInt(id, 10);
    const ordersRepository = new OrdersRepository();
    const robotsRepository = new RobotsRepository();
    const ordersController = new OrdersController(
      ordersRepository,
      robotsRepository
    );
    const order = await ordersController.assignRobot(orderId);
    return Response.json(order, { status: 200 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected Error";
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}
