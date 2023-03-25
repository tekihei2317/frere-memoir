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

export type DisposeFlowerWorkflow<DisposeFlowerInput> = {
  input: DisposeFlowerInput;
  output: Promise<FlowerDisposal>;
  deps: {
    validateDisposeFlowerInput: (input: DisposeFlowerInput) => Promise<DisposeFlowerInput>;
    persistFlowerDisposal: (input: DisposeFlowerInput) => Promise<FlowerDisposal>;
    updateFlowerInventory: (flowerDisposal: FlowerDisposal) => Promise<FlowerInventory>;
  };
};
