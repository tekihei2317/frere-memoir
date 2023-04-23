import { prisma } from "../database/prisma";
import { adminProcedure, notFoundError } from "../trpc/initialize";
import { PurchaseIdInput } from "./api-schema";
import { CreatedPurchase } from "./core/types";

async function findUndeliveredPurchase(purchaseId: number): Promise<CreatedPurchase> {
  const purchase = await prisma.flowerOrder.findFirst({
    where: { id: purchaseId, arrivedEvent: null },
    include: { orderDetails: { include: { flower: true } } },
  });
  if (purchase === null) throw notFoundError;

  return purchase;
}

async function sendCancelPurchaseEmail(purchase: CreatedPurchase): Promise<void> {}

async function deletePurchase(purchase: CreatedPurchase): Promise<void> {
  await prisma.flowerOrderDetail.deleteMany({ where: { flowerOrderId: purchase.id } });
  await prisma.flowerOrder.delete({ where: { id: purchase.id } });
}

export const cancelPurchase = adminProcedure.input(PurchaseIdInput).mutation(async ({ ctx, input }): Promise<void> => {
  const purchase = await findUndeliveredPurchase(input.purchaseId);

  // TODO: トランザクション
  await deletePurchase(purchase);
  await sendCancelPurchaseEmail(purchase);
});
