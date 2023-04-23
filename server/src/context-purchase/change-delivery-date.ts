import { TRPCError } from "@trpc/server";
import { adminProcedure, notFoundError } from "../trpc/initialize";
import { ChangeDeliveryDateInput } from "./api-schema";
import { CreatedPurchase } from "./core/types";
import { checkIfDeliverable } from "./purchase-util";
import { prisma } from "../database/prisma";

async function findPurchaseById(purchaseId: number): Promise<CreatedPurchase> {
  const purchase = await prisma.flowerOrder.findUnique({
    where: { id: purchaseId },
    include: {
      orderDetails: { include: { flower: true } },
    },
  });
  if (purchase === null) throw notFoundError;

  return purchase;
}

async function updateDeliveryDate(purchase: CreatedPurchase): Promise<void> {
  await prisma.flowerOrder.update({
    where: { id: purchase.id },
    data: { deliveryDate: purchase.deliveryDate },
  });
}

/**
 * 納品希望日を変更する
 */
export const changeDeliveryDate = adminProcedure
  .input(ChangeDeliveryDateInput)
  .mutation(async ({ input }): Promise<CreatedPurchase> => {
    const purchase = await findPurchaseById(input.purchaseId);
    const updatedPurchase: CreatedPurchase = { ...purchase, deliveryDate: new Date(input.deliveryDate) };

    if (!checkIfDeliverable(updatedPurchase)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "納品希望日は、発注リードタイムより後の日付を入力してください",
      });
    }
    await updateDeliveryDate(updatedPurchase);

    return purchase;
  });
