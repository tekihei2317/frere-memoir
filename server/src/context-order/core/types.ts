import { Customer } from "../../context-auth/public-types";
import { Flower } from "../../context-maintenance/public-types";
import { DefineWorkflow } from "../../utils/workflow";

type ValidatedOrderDetail = {
  flower: Flower;
};

export type ValidatedOrder = {
  customerId: number;
  senderName: string;
  bouquetId: number;
  deliveryDate: Date;
  deliveryAddress1: string;
  deliveryAddress2?: string | undefined;
  deliveryMessage?: string | undefined;
  totalAmount: number;
  orderDetails: ValidatedOrderDetail[];
};

export type PlacedOrder = {
  id: number;
  customerId: number;
  senderName: string;
  bouquetId: number;
  deliveryDate: Date;
  deliveryAddress1: string;
  deliveryAddress2: string | null;
  deliveryMessage: string | null;
  totalAmount: number;
};

export type ShippedOrder = undefined;
export type Order = PlacedOrder | ShippedOrder;

/**
 * 注文する
 */
export type PlaceOrderWorkflow<PlaceOrderForm> = DefineWorkflow<{
  input: { form: PlaceOrderForm; customer: Customer };
  output: Promise<PlacedOrder>;
  steps: {
    validateOrderForm: (form: PlaceOrderForm, customer: Customer) => Promise<ValidatedOrder>;
    /** 在庫があるか、注文して間に合うかを判定する */
    checkStock: (form: ValidatedOrder) => Promise<boolean>;
    persistOrder: (order: ValidatedOrder) => Promise<PlacedOrder>;
    processPayment: (order: PlacedOrder) => Promise<void>;
  };
}>;

type ChangeDeliveryDateInput = {
  orderId: number;
  deliveryDate: Date;
};

/**
 * お届け日を変更する
 */
export type ChangeDeliveryDateWorkflow = DefineWorkflow<{
  input: ChangeDeliveryDateInput;
  output: Promise<PlacedOrder>;
  steps: {
    findPlacedOrder: (orderId: number) => Promise<PlacedOrder>;
    changeDeliveryDate: (order: PlacedOrder, deliveryDate: Date) => PlacedOrder;
    checkStock: (order: PlacedOrder) => Promise<boolean>;
    persistOrder: (order: PlacedOrder) => Promise<void>;
  };
}>;

/**
 * 注文をキャンセルする
 */
export type CancelOrderWorkflow = DefineWorkflow<{
  input: { orderId: number };
  output: Promise<void>;
  steps: {
    findPlacedOrder: (orderId: number) => Promise<PlacedOrder>;
    deletePlacedOrder: (order: PlacedOrder) => Promise<void>;
    processRefund: (order: PlacedOrder) => Promise<void>;
  };
}>;
