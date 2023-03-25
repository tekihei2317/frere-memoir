import { PurchaseStatus } from "./purchase-types";

export function getPurchaseStatus<T>(purchase: { arrivedEvent: T | null }): PurchaseStatus {
  if (purchase.arrivedEvent === null) return "placed";
  return "arrived";
}
