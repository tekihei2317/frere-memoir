import { adminProcedure, notFoundError } from "../trpc/initialize";
import { getPurchaseStatus } from "./purchase-query-util";
import { PurchaseIdInput } from "./purchase-schema";

export const getPurchase = adminProcedure.input(PurchaseIdInput).query(async ({ ctx, input }) => {
  const purchase = await ctx.prisma.flowerOrder.findUnique({
    where: { id: input.purchaseId },
    include: {
      orderDetails: { include: { flower: true, arrival: true } },
      arrivedEvent: true,
    },
  });
  if (purchase === null) throw notFoundError;

  return {
    ...purchase,
    status: getPurchaseStatus(purchase),
  };
});
