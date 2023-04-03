import { OrderStatus } from "./types";

export function getOrderStatus<T>(order: { shipment: T | null }): OrderStatus {
  if (order.shipment === null) return "placed";
  return "shipped";
}
