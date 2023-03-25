import { adminProcedure } from "../trpc/initialize";
import { getPurchaseStatus } from "./purchase-query-util";

export const getPurchases = adminProcedure.query(async ({ ctx }) => {
  const purchases = await ctx.prisma.flowerOrder.findMany({
    select: {
      id: true,
      deliveryDate: true,
      purchaseNumber: true,
      arrivedEvent: true,
    },
  });

  return purchases.map((purchase) => ({
    ...purchase,
    status: getPurchaseStatus(purchase),
  }));
});
