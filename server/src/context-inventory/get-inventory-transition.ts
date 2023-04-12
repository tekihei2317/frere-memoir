import { FlowerIdInput } from "../context-maintenance/api-schema";
import { adminProcedure } from "../trpc/initialize";
import { calculateInventoryTransition } from "./core/inventory-transition";
import { fetchCurrentInventories, fetchInventorySchedules } from "./persistence/inventory-query";

/**
 * 在庫推移を取得する
 */
export const getInventoryTransition = adminProcedure.input(FlowerIdInput).query(async ({ input }) => {
  const today = new Date();
  const [inventorySchedules, currentInventories] = await Promise.all([
    fetchInventorySchedules(input.flowerId, today),
    fetchCurrentInventories(input.flowerId, today),
  ]);

  return calculateInventoryTransition({
    inventorySchedules,
    currentInventories,
    today: new Date(),
  });
});
