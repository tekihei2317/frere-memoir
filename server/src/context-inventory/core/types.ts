export type InventorySummary = {
  flowerId: number;
  flowerName: string;
  /** 在庫数 */
  stockCount: number;
  /** 入荷予定数 */
  expectedArrivalCount: number;
  /** 出荷予定数 */
  expectedShipmentCount: number;
};

export type FlowerInventory = {
  id: number;
  flowerId: number;
  arrivalDate: Date;
  currentQuantity: number;
};

export type FlowerDisposal = {
  id: number;
  flowerInventoryId: number;
  disposedCount: number;
};
