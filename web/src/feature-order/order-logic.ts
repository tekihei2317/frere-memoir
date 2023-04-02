export type OrderStatus = "placed" | "shipped";

export function getOrderStatusLabel(status: OrderStatus): string {
  return status === "placed" ? "注文済み" : "出荷済み";
}
