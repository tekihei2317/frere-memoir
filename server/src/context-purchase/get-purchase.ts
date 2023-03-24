import { adminProcedure, notFoundError } from "../trpc/initialize";
import { PurchaseIdInput } from "./purchase-schema";
import { PurchaseStatus } from "./purchase-types";

function getPurchaseStatus<T>(purchase: { arrivedEvent: T | null }): PurchaseStatus {
  if (purchase.arrivedEvent === null) return "placed";
  return "placed";
}

export const getPurchase = adminProcedure.input(PurchaseIdInput).query(async ({ ctx, input }) => {
  const purchase = await ctx.prisma.flowerOrder.findUnique({
    where: { id: input.purchaseId },
    include: {
      orderDetails: { include: { flower: true } },
      arrivedEvent: true,
    },
  });
  if (purchase === null) throw notFoundError;

  return {
    ...purchase,
    status: getPurchaseStatus(purchase),
  };
});
