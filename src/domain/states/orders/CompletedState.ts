import { OrderState } from "./OrderState";

export class CompletedState implements OrderState {
  next(): void {
    throw new Error("Order is already completed. No further actions allowed");
  }
}
