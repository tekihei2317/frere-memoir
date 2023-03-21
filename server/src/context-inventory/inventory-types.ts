export type InventorySummary = {
  flowerId: number;
  flowerName: number;
  /** 在庫数 */
  stockCount: number;
  /** 入荷予定数 */
  expectedArrivalCount: number;
  /** 出荷予定数 */
  expectedShipmentCount: number;
};
