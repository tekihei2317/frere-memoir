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
 * 仕入れが、希望納品日に納品可能かどうかを判定する
 */
export type CheckIfDeliverable = (purchase: Purchase) => boolean;

/**
 * 仕入れする
 */
export type CreatePurchaseWorkflow<CreatePurchaseInput> = {
  input: CreatePurchaseInput;
  output: Promise<CreatedPurchase>;
  deps: {
    fetchFlowers: (input: CreatePurchaseInput) => Promise<Purchase>;
    checkIfDeliverable: CheckIfDeliverable;
    persistPurchase: (purchase: Purchase) => Promise<CreatedPurchase>;
    sendPurchaseEmail: (purchase: Purchase) => Promise<void>;
  };
};

/**
 * 納品希望日を変更する
 */
export type ChangeDeliveryDateWorkflow<ChangeDeliveryDateInput> = {
  input: ChangeDeliveryDateInput;
  output: Promise<CreatedPurchase>;
  deps: {
    findPurchaseById: (purchaseId: number) => Promise<CreatedPurchase>;
    checkIfDeliverable: CheckIfDeliverable;
    updateDeliveryDate: (purchase: CreatedPurchase) => void;
  };
};
