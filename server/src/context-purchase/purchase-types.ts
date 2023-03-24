import { Flower } from "../context-maintenance/maintenance-types";

/**
 * 仕入れ明細
 */
export type PurchaseDetail = {
  flower: Flower;
  orderQuantity: number;
};

/**
 * 仕入れステータス
 */
export type PurchaseStatus = "placed" | "arrived";

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
 * 仕入れが希望納品日に納品可能かどうかを判定する
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

/**
 * 仕入れをキャンセルする
 */
export type CancelPurchaseWorkflow<CancelPurchaseInput> = {
  input: CancelPurchaseInput;
  output: Promise<void>;
  deps: {
    findUndeliveredPurchase: (purchaseId: number) => Promise<CreatedPurchase>;
    sendCancelPurchaseEmail: (purchase: CreatedPurchase) => Promise<void>;
    deletePurchase: (purchase: CreatedPurchase) => Promise<void>;
  };
};

export type ValidatedPurchaseArrival = {
  purchaseId: number;
  arrivalDetails: ValidatedArrivalDetail[];
};

export type ValidatedArrivalDetail = {
  arrivedCount: number;
};

/**
 * 仕入れの到着
 */
export type PurchaseArrival = {
  purchaseId: number;
  arrivalDetails: ArrivalDetail[];
  arrivedAt: Date;
};

export type ArrivalDetail = {
  arrivedCount: number;
  orderDetail: { id: number; flowerId: number };
};

/**
 * 仕入れ情報を登録する
 */
export type RegisterArrivalInformationWorkflow<ArrivalInformation> = {
  input: ArrivalInformation;
  output: Promise<void>;
  deps: {
    findPurchaseById: (purchaseId: number) => Promise<CreatedPurchase>;
    validateArrivalInformation: (
      input: ArrivalInformation,
      purchase: CreatedPurchase
    ) => Promise<ValidatedPurchaseArrival>;
    // データベース上、在庫がないと仕入れが登録できないようになっている。そのため、ここで在庫の登録も行う。
    // 在庫に必要な型が隠れているので、あまり良くない設計。
    persistArrivalInformation: (arrival: ValidatedPurchaseArrival) => void;
  };
};
