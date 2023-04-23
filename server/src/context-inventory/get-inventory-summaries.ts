import { prisma } from "../database/prisma";
import { InventorySummary } from "./core/types";

type FlowerQuantity = {
  flowerId: number;
  quantity: number;
};

type InventoryQuantity = {
  flowerId: number;
  flowerName: string;
  quantity: number;
};

export async function getInventorySummaries(): Promise<InventorySummary[]> {
  const [inventoryQuantity, purchaseQuantity, orderQuantity] = await Promise.all([
    prisma.$queryRaw<InventoryQuantity[]>`
      select
        Flower.id as flowerId,
        Flower.name as flowerName,
        coalesce(sum(FlowerInventory.currentQuantity), 0) as quantity
      from
        Flower
        left outer join FlowerInventory on Flower.id = FlowerInventory.flowerId
      group by
        Flower.id
      order by
        Flower.id
    `,
    prisma.$queryRaw<FlowerQuantity[]>`
      select
        flowerId,
        sum(orderQuantity) as quantity
      from
        FlowerOrderDetail
      where
        FlowerOrderDetail.id not in (
          select
            flowerOrderDetailId
          from
            FlowerOrderDetailArrival
        )
      group by
        flowerId
      ;
    `,
    prisma.$queryRaw<FlowerQuantity[]>`
      select
        BouquetDetail.flowerId,
        sum(BouquetDetail.flowerQuantity) as quantity
      from
        BouquetOrder
        inner join Bouquet on BouquetOrder.bouquetId = Bouquet.id
        inner join BouquetDetail on BouquetDetail.bouquetId = Bouquet.id
      where
        BouquetOrder.id not in (
          select
            bouquetOrderId
          from
            BouquetOrderShipment
        )
      group by
        BouquetDetail.flowerId
      ;
    `,
  ]);

  const purchaseQuantityMap = new Map(purchaseQuantity.map((flower) => [flower.flowerId, flower.quantity]));
  const orderQuantityMap = new Map(orderQuantity.map((flower) => [flower.flowerId, flower.quantity]));

  return inventoryQuantity.map((inventory) => ({
    ...inventory,
    stockCount: inventory.quantity,
    expectedArrivalCount: purchaseQuantityMap.get(inventory.flowerId) ?? 0,
    expectedShipmentCount: orderQuantityMap.get(inventory.flowerId) ?? 0,
  }));
}
