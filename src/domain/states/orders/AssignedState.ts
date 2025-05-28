import { Order } from "@/domain/entities/Order";
import { OrderState } from "./OrderState";
import { Robot } from "@/domain/entities/Robot";

export class AssignedState implements OrderState {
  next(order: Order, robot: Robot): void {
    order.setStatus("picked_up");
    robot.setLastKnownLocation(order.getClient()?.address || "");
  }
}
