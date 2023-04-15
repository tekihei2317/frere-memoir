import { Flower } from "../../context-maintenance/core/types";

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

export type UnvalidatedPurchaseArrival = {
  purchaseId: number;
  arrivalDetails: UnvalidatedArrivalDetail[];
};

export type UnvalidatedArrivalDetail = {
  arrivedCount: number;
  orderDetailId: number;
};

/**
 * 仕入れの到着
 */
export type PurchaseArrival = {
  purchaseId: number;
  arrivedAt: Date;
  arrivalDetails: ArrivalDetail[];
};

export type ArrivalDetail = {
  arrivedCount: number;
  orderDetail: { id: number; flowerId: number };
};

export type ValidateArrivalDetails = (
  details: UnvalidatedArrivalDetail[],
  purchase: Purchase
) => Promise<ArrivalDetail[]>;
