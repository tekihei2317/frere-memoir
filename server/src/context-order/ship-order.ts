import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { adminProcedure, notFoundError } from "../trpc/initialize";
import { OrderIdInput } from "./api-schema";
import { PlacedOrder, Shipment, ShipmentDetail } from "./core/types";
import { findPlacedOrder } from "./persistence/order-query";
import { Bouquet } from "../context-maintenance/public-types";
import { findBouquet } from "../context-maintenance/persistence/bouquet-query";
import { assertNonNullable } from "../utils/assertion";

/**
 * 出荷情報を作成する
 */
async function createShipment(tx: Prisma.TransactionClient, order: PlacedOrder, bouquet: Bouquet): Promise<Shipment> {
  return {
    orderId: order.id,
    shippedAt: new Date(),
    shipmentDetails: await createShipmentDetails(tx, bouquet),
  };
}

/**
 * 出荷明細を作成する
 */
async function createShipmentDetails(tx: Prisma.TransactionClient, bouquet: Bouquet): Promise<ShipmentDetail[]> {
  // 核は何潰えて、在庫の古い方から順番に出荷します
  const shipmentDetails = await Promise.all(
    bouquet.bouquetDetails.map(async (detail) => {
      let flowerQuantity = detail.flowerQuantity;
      const shipmentDetails: ShipmentDetail[] = [];

      while (flowerQuantity > 0) {
        const inventory = await tx.flowerInventory.findFirst({
          where: { flowerId: detail.flower.id, currentQuantity: { gt: 0 } },
          orderBy: { arrivalDate: "asc" },
        });

        if (inventory === null) {
          // 数量が0より大きい在庫がない場合は、在庫が不足している
          throw new TRPCError({ code: "BAD_REQUEST", message: `${detail.flower.name}の在庫が不足しています` });
        }

        const shippedQuantity = Math.min(flowerQuantity, inventory.currentQuantity);
        flowerQuantity -= shippedQuantity;

        shipmentDetails.push({ orderDetailId: detail.id, inventoryId: inventory.id, shippedQuantity });
      }

      return shipmentDetails;
    })
  );

  return shipmentDetails.flat();
}

/**
 * 出荷情報を登録する
 */
async function persistShipment(tx: Prisma.TransactionClient, shipment: Shipment): Promise<void> {
  await tx.bouquetOrderShipment.create({
    data: {
      bouquetOrderId: shipment.orderId,
      shippedAt: shipment.shippedAt,
      orderDetailShipments: {
        createMany: {
          data: shipment.shipmentDetails.map((detail) => ({
            inventoryId: detail.inventoryId,
            shippedQuantity: detail.shippedQuantity,
          })),
        },
      },
    },
  });
}

/**
 * 在庫を更新する
 */
async function updateInventories(tx: Prisma.TransactionClient, shipment: Shipment): Promise<void> {
  await Promise.all(
    shipment.shipmentDetails.map((detail) => {
      return tx.flowerInventory.update({
        where: { id: detail.inventoryId },
        data: { currentQuantity: { decrement: detail.shippedQuantity } },
      });
    })
  );
}

/**
 * 花束の注文を出荷する
 */
export const shipOrder = adminProcedure.input(OrderIdInput).mutation(async ({ ctx, input }) => {
  const order = await findPlacedOrder(input.orderId);
  if (order === null) throw notFoundError;

  const bouquet = await findBouquet(order.bouquetId);
  assertNonNullable(bouquet);

  await ctx.prisma.$transaction(async (tx) => {
    const shipment = await createShipment(tx, order, bouquet);
    await persistShipment(tx, shipment);
    await updateInventories(tx, shipment);
  });
});
