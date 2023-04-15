import { prisma } from "../../database/prisma";
import { formatDate } from "../../utils/format";
import { InventorySchedule } from "../core/inventory-transition";
import { addDays, startOfDay } from "date-fns";

type QuantityByDate = {
  date: Date;
  quantity: number;
};

/**
 * 入荷予定数を取得する
 */
function fetchArrivalQuantities(flowerId: number, startDate: Date, endDate: Date): Promise<QuantityByDate[]> {
  return prisma.$queryRaw`
    select
      FlowerOrder.deliveryDate as date,
      sum(FlowerOrderDetail.orderQuantity) as quantity
    from
      FlowerOrder
      inner join FlowerOrderDetail on FlowerOrderDetail.flowerOrderId = FlowerOrder.id
    where
      FlowerOrderDetail.flowerId = ${flowerId}
      and FlowerOrder.deliveryDate >= ${formatDate(startDate)}
      and FlowerOrder.deliveryDate < ${formatDate(endDate)}
    group by
      FlowerOrder.deliveryDate
    ;
  `;
}

/**
 * 出荷予定数を取得する
 */
function fetchShipmentQuantities(flowerId: number, startDate: Date, endDate: Date): Promise<QuantityByDate[]> {
  return prisma.$queryRaw`
    select
      BouquetOrder.deliveryDate as date,
      sum(BouquetDetail.flowerQuantity) as quantity
    from
      BouquetOrder
      inner join Bouquet on BouquetOrder.bouquetId = Bouquet.id
      inner join BouquetDetail on BouquetDetail.bouquetId = Bouquet.id
    where
      BouquetDetail.flowerId = ${flowerId}
      and BouquetOrder.deliveryDate >= ${formatDate(startDate)}
      and BouquetOrder.deliveryDate < ${formatDate(endDate)}
    group by
      BouquetOrder.deliveryDate
    ;
  `;
}

/**
 * 一週間分の在庫の入出庫予定数を取得する
 */
export async function fetchInventorySchedules(flowerId: number, today: Date): Promise<InventorySchedule[]> {
  const startOfToday = startOfDay(today);
  const [arrivalQuantities, shipmentQuantities] = await Promise.all([
    fetchArrivalQuantities(flowerId, startOfToday, addDays(startOfToday, 7)),
    fetchShipmentQuantities(flowerId, addDays(startOfToday, 1), addDays(startOfToday, 8)),
  ]);

  const arrivalMap = new Map(arrivalQuantities.map((quantity) => [formatDate(quantity.date), quantity.quantity]));
  const shipmentMap = new Map(shipmentQuantities.map((quantity) => [formatDate(quantity.date), quantity.quantity]));

  const schedules: InventorySchedule[] = [...new Array(7)].map((_, index) => {
    return {
      arrivalQuantity: arrivalMap.get(formatDate(addDays(startOfToday, index))) ?? 0,
      // お届け日付の1日前に出荷するため、+1している
      shipmentQuantity: shipmentMap.get(formatDate(addDays(startOfToday, index + 1))) ?? 0,
    };
  });

  return schedules;
}

/**
 * 現在の日付別在庫数を取得する。品質維持可能日数ぶん取得する。
 */
export async function fetchCurrentInventories(flowerId: number, today: Date): Promise<number[]> {
  const startOfToday = startOfDay(today);
  const flower = await prisma.flower.findUniqueOrThrow({ where: { id: flowerId } });

  const inventories = await prisma.flowerInventory.findMany({
    where: {
      flowerId,
      arrivalDate: {
        gte: addDays(startOfToday, -flower.maintanableDays),
        lt: startOfToday,
      },
    },
  });
  const inventoryMap = new Map(
    inventories.map((inventory) => [formatDate(inventory.arrivalDate), inventory.currentQuantity])
  );

  return [...new Array(flower.maintanableDays)].map((_, days) => {
    const dateString = formatDate(addDays(today, -(days + 1)));
    return inventoryMap.get(dateString) ?? 0;
  });
}
