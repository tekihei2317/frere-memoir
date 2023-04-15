import { calculateInventoryTransition } from "./inventory-transition";

describe(calculateInventoryTransition, () => {
  test("在庫推移を計算できること", () => {
    const result = calculateInventoryTransition({
      inventorySchedules: [
        { arrivalQuantity: 200, shipmentQuantity: 20 },
        { arrivalQuantity: 300, shipmentQuantity: 50 },
        { arrivalQuantity: 200, shipmentQuantity: 80 },
        { arrivalQuantity: 200, shipmentQuantity: 20 },
        { arrivalQuantity: 0, shipmentQuantity: 400 },
        { arrivalQuantity: 0, shipmentQuantity: 170 },
        { arrivalQuantity: 100, shipmentQuantity: 40 },
      ],
      currentInventories: [0, 0, 0],
      today: new Date("2023-01-01"),
    });

    expect(result.length).toBe(7);
    expect(result).toMatchObject([
      { arrivalQuantity: 200, inventories: [180, 0, 0, 0] },
      { arrivalQuantity: 300, inventories: [300, 130, 0, 0] },
      { arrivalQuantity: 200, inventories: [200, 300, 50, 0] },
      { arrivalQuantity: 200, inventories: [200, 200, 300, 30] },
      { arrivalQuantity: 0, inventories: [0, 200, 100, 0] },
      { arrivalQuantity: 0, inventories: [0, 0, 130, 0] },
      { arrivalQuantity: 100, inventories: [100, 0, 0, 90] },
    ]);
  });
});
