import { Order } from "@/domain/entities/Order";
import { Robot } from "@/domain/entities/Robot";
import { OrderState } from "./OrderState";

export class PickedUpState implements OrderState {
  next(order: Order, robot: Robot): void {
    order.setStatus("delivered");
    robot.setLastKnownLocation(order.getRestaurant()?.address || "");
  }
}
