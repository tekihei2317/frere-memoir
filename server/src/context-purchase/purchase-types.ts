import { Flower } from "../context-maintenance/maintenance-types";

/**
 * 仕入れ明細
 */
export type PurchaseDetail = {
  flower: Flower;
  orderQuantity: number;
};

/**
 * 仕入れ
 */
export type Purchase = {
  deliveryDate: Date;
  purchaseNumber: string;
  orderDetails: PurchaseDetail[];
};

export type CreatedPurchase = Purchase & {
  id: number;
};

/**
 * 仕入れする
 */
export type CreatePurchaseWorkflow<CreatePurchaseInput> = {
  input: CreatePurchaseInput;
  output: Promise<CreatedPurchase>;
  deps: {
    fetchFlowers: (input: CreatePurchaseInput) => Promise<Purchase>;
    checkIfDeliverable: (purchase: Purchase) => boolean;
    persistPurchase: (purchase: Purchase) => Promise<CreatedPurchase>;
    sendPurchaseEmail: (purchase: Purchase) => Promise<void>;
  };
};
