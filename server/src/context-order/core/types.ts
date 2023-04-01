import { Flower } from "../../context-maintenance/public-types";

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

export type FindPlacedOrder = (orderId: number) => Promise<PlacedOrder>;
