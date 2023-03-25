import { adminProcedure } from "../trpc/initialize";
import { FlowerIdInput } from "../context-maintenance/maintenance-schema";

/**
 * ある花の在庫を取得する
 */
export const getFlowerInventories = adminProcedure.input(FlowerIdInput).query(async ({ ctx, input }) => {
  const inventories = await ctx.prisma.flowerInventory.findMany({
    where: { flowerId: input.flowerId, currentQuantity: { gt: 0 } },
    orderBy: { arrivalDate: "desc" },
  });

  return inventories;
});
