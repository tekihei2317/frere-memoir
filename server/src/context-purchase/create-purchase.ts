import { TRPCError } from "@trpc/server";
import { adminProcedure } from "../trpc/initialize";
import { CreatePurchaseInput } from "./api-schema";
import { checkIfDeliverable } from "./purchase-util";
import { CreatedPurchase, Purchase } from "./core/types";
import { prisma } from "../database/prisma";

async function fetchFlowers(input: CreatePurchaseInput): Promise<Purchase> {
  const flowerIds = input.details.map((detail) => detail.flowerId);
  const flowers = await prisma.flower.findMany({ where: { id: { in: flowerIds } } });
  const flowerMap = new Map(flowers.map((flower) => [flower.id, flower]));

  return {
    purchaseNumber: "",
    deliveryDate: new Date(input.deliveryDate),
    orderDetails: input.details.map((detail) => {
      const flower = flowerMap.get(detail.flowerId);
      if (flower === undefined) throw new TRPCError({ code: "BAD_REQUEST", message: "選択した花が存在しません" });

      return { ...detail, flower };
    }),
  };
}

async function persistPurchase(purchase: Purchase): Promise<CreatedPurchase> {
  const createdPurchase = await prisma.flowerOrder.create({
    data: {
      purchaseNumber: purchase.purchaseNumber,
      deliveryDate: purchase.deliveryDate,
      orderDetails: {
        createMany: {
          data: purchase.orderDetails.map((detail) => ({
            flowerId: detail.flower.id,
            orderQuantity: detail.orderQuantity,
          })),
        },
      },
    },
    include: {
      orderDetails: { include: { flower: true } },
    },
  });

  return createdPurchase;
}

async function sendPurchaseEmail(purchase: Purchase): Promise<void> {}

/**
 * 仕入れする
 */
export const createPurchase = adminProcedure.input(CreatePurchaseInput).mutation(async ({ ctx, input }) => {
  const purchase = await fetchFlowers(input);

  if (!checkIfDeliverable(purchase)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "納品希望日は、発注リードタイムより後の日付を入力してください",
    });
  }

  // TODO: トランザクションを使う or メールをキューで送信する
  const createdPurchase = await persistPurchase(purchase);
  await sendPurchaseEmail(createdPurchase);

  return createdPurchase;
});
