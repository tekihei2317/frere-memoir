import { InventorySchedule, InventoryTransition } from "../core/inventory-transition";

/**
 * 一週間分の在庫の入出庫予定数を取得する
 */
export async function fetchInventorySchedules(flowerId: number, today: Date): Promise<InventorySchedule[]> {
  return [];
}

/**
 * 現在の日付別在庫数を取得する。品質維持可能日数ぶん取得する。
 */
export async function fetchCurrentInventories(flowerId: number, today: Date): Promise<number[]> {
  return [];
}
