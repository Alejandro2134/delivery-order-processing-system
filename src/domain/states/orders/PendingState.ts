import { Order } from "@/domain/entities/Order";
import { Robot } from "@/domain/entities/Robot";
import { OrderState } from "./OrderState";

export class PendingState implements OrderState {
  next(order: Order, robot: Robot): void {
    order.setRobotId(robot.getId());
    order.setStatus("assigned");
    robot.changeStatus("busy");
  }
}
