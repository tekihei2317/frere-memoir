import { PrismaClient } from "@prisma/client";
import { InventorySummary } from "./inventory-types";

export async function getInventorySummaries(prisma: PrismaClient) {
  return prisma.$queryRaw<InventorySummary[]>`
    select
      Flower.id as flowerId,
      Flower.name as flowerName,
      coalesce(sum(FlowerInventory.currentQuantity), 0) as stockCount,
      0.0 as expectedArrivalCount,
      0.0 as expectedShipmentCount
    from
      Flower
      left outer join FlowerInventory on Flower.id = FlowerInventory.flowerId
    group by
      Flower.id
    order by
      Flower.id
  `;
}