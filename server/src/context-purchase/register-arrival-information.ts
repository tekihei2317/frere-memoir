import { TRPCError } from "@trpc/server";
import { RegisterArrivalInformationInput } from "./api-schema";
import {
  ArrivalDetail,
  CreatedPurchase,
  PurchaseArrival,
  UnvalidatedArrivalDetail,
  UnvalidatedPurchaseArrival,
} from "./core/types";
import { fixDateForPrisma, prisma } from "../database/prisma";
import { adminProcedure } from "../trpc/initialize";
import { throwNotFoundErrorIfNull } from "../utils/trpc";

async function findPurchaseById(purchaseId: number): Promise<CreatedPurchase | null> {
  const purchase = await prisma.flowerOrder.findUnique({
    where: { id: purchaseId },
    include: {
      orderDetails: { include: { flower: true } },
    },
  });

  return purchase;
}

async function validateArrivalDetails(arrivalDetails: UnvalidatedArrivalDetail[]): Promise<ArrivalDetail[]> {
  const orderDetailIds = arrivalDetails.map((detail) => detail.orderDetailId);
  const uniqueOrderDetailIds = [...new Set(orderDetailIds)];

  if (orderDetailIds.length > uniqueOrderDetailIds.length) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "仕入れ明細IDが重複しています" });
  }

  // ここでIOしない方がよさそう
  const orderDetails = await prisma.flowerOrderDetail.findMany({ where: { id: { in: uniqueOrderDetailIds } } });
  if (orderDetails.length < arrivalDetails.length) {
    // 仕入れ明細IDに、データベースに存在しないものがある
    throw new TRPCError({ code: "BAD_REQUEST", message: "仕入れ明細IDが正しくありません" });
  }
  if (arrivalDetails.length < orderDetails.length) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "入荷明細が不足しています" });
  }

  const orderDetailsMap = new Map(orderDetails.map((detail) => [detail.id, detail]));

  return arrivalDetails.map((detail) => ({ ...detail, orderDetail: orderDetailsMap.get(detail.orderDetailId)! }));
}

async function validateArrivalInformation({
  arrival,
  purchase,
}: {
  arrival: UnvalidatedPurchaseArrival;
  purchase: CreatedPurchase;
}): Promise<PurchaseArrival> {
  const validatedArrivalDetails = await validateArrivalDetails(arrival.arrivalDetails);

  return {
    purchaseId: arrival.purchaseId,
    arrivedAt: new Date(),
    arrivalDetails: validatedArrivalDetails,
  };
}

async function persistArrivalInformation(arrivalInfo: PurchaseArrival): Promise<void> {
  // 在庫を作成する
  const inventories = await Promise.all(
    arrivalInfo.arrivalDetails.map(async (detail) => {
      const inventory = await prisma.flowerInventory.upsert({
        where: {
          flowerId_arrivalDate: {
            flowerId: detail.orderDetail.flowerId,
            arrivalDate: fixDateForPrisma(arrivalInfo.arrivedAt),
          },
        },
        create: {
          flowerId: detail.orderDetail.flowerId,
          arrivalDate: fixDateForPrisma(arrivalInfo.arrivedAt),
          currentQuantity: detail.arrivedCount,
        },
        update: {
          currentQuantity: { increment: detail.arrivedCount },
        },
      });

      return inventory;
    })
  );

  // 入荷情報を登録する
  const inventoryMap = new Map(inventories.map((inventory) => [inventory.flowerId, inventory]));
  await prisma.flowerOrderArrival.create({
    data: {
      flowerOrderId: arrivalInfo.purchaseId,
      arrivedAt: arrivalInfo.arrivedAt,
      orderDetailArrivals: {
        createMany: {
          data: arrivalInfo.arrivalDetails.map((detail) => ({
            flowerOrderDetailId: detail.orderDetail.id,
            arrivedQuantity: detail.arrivedCount,
            flowerInventoryId: inventoryMap.get(detail.orderDetail.flowerId)!.id,
          })),
        },
      },
    },
  });
}

/**
 * 仕入れ情報を登録する
 */
export const registerArrivalInformation = adminProcedure
  .input(RegisterArrivalInformationInput)
  .mutation(async ({ input }) => {
    const purchase = throwNotFoundErrorIfNull(await findPurchaseById(input.purchaseId));
    const arrival = await validateArrivalInformation({
      arrival: input,
      purchase,
    });

    await persistArrivalInformation(arrival);
  });
