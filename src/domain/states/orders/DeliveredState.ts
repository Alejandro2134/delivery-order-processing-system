import { Order } from "@/domain/entities/Order";
import { Robot } from "@/domain/entities/Robot";
import { OrderState } from "./OrderState";

export class DeliveredState implements OrderState {
  next(order: Order, robot: Robot): void {
    order.setStatus("completed");
    robot.setLastKnownLocation("Kiwibot HQ");
    robot.setStatus("available");
    order.setCompletedAt(new Date());
  }
}
