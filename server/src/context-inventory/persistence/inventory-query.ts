import { prisma } from "../../database/prisma";
import { formatDate } from "../../utils/format";
import { InventorySchedule, InventoryTransition } from "../core/inventory-transition";
import { addDays, startOfDay } from "date-fns";

type QuantityByDate = {
  date: string;
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
    group by
      BouquetOrder.deliveryDate
    ;
  `;
}

/**
 * 一週間分の在庫の入出庫予定数を取得する
 */
export async function fetchInventorySchedules(flowerId: number, today: Date): Promise<InventorySchedule[]> {
  const [arrivalQuantities, shipmentQuantities] = await Promise.all([
    fetchArrivalQuantities(flowerId, startOfDay(today), addDays(startOfDay(today), 7)),
    fetchShipmentQuantities(flowerId, addDays(startOfDay(today), 1), addDays(startOfDay(today), 8)),
  ]);

  const arrivalMap = new Map(arrivalQuantities.map((quantity) => [quantity.date, quantity.quantity]));
  const shipmentMap = new Map(shipmentQuantities.map((quantity) => [quantity.date, quantity.quantity]));

  const schedules: InventorySchedule[] = [...new Array(7)].map((_, index) => {
    const dateString = formatDate(addDays(today, index));

    return {
      arrivalQuantity: arrivalMap.get(dateString) ?? 0,
      shipmentQuantity: shipmentMap.get(dateString) ?? 0,
    };
  });

  return schedules;
}

/**
 * 現在の日付別在庫数を取得する。品質維持可能日数ぶん取得する。
 */
export async function fetchCurrentInventories(flowerId: number, today: Date): Promise<number[]> {
  // TODO:
  return [0, 0, 0, 0, 0];
}
