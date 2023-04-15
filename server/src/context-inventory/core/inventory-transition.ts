import { addDays } from "date-fns";

export type InventorySchedule = {
  arrivalQuantity: number;
  shipmentQuantity: number;
};

export type InventoryTransition = {
  date: Date;
  arrivalQuantity: number;
  shipmentQuantity: number;
  inventories: number[];
};

/**
 * 在庫推移を計算する
 *
 * @param inventorySchedules 一週間分の在庫予定
 * @param currentInventories 現在の在庫（在庫は新しい順で、最初の要素が1日前に仕入れた在庫数）
 */
export function calculateInventoryTransition({
  inventorySchedules,
  currentInventories,
  today,
}: {
  inventorySchedules: InventorySchedule[];
  currentInventories: number[];
  today: Date;
}): InventoryTransition[] {
  const transitions: InventoryTransition[] = [];

  inventorySchedules.forEach((schedule, index) => {
    const previousInventories: number[] =
      index === 0 ? currentInventories : transitions[index - 1].inventories.slice(0, -1);
    const quantities = [schedule.arrivalQuantity, ...previousInventories];

    let rest = schedule.shipmentQuantity;
    for (let index = quantities.length - 1; index >= 0; index--) {
      if (rest === 0) break;

      const quantity = Math.min(rest, quantities[index]);
      quantities[index] -= quantity;
      rest -= quantity;
    }

    // TODO: 在庫が不足している場合(rest > 0)は、メタ情報を追加する
    transitions.push({
      arrivalQuantity: schedule.arrivalQuantity,
      shipmentQuantity: schedule.shipmentQuantity,
      date: addDays(today, index),
      inventories: quantities,
    });
  });

  return transitions;
}
