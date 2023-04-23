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

export type OrderStatus = "placed" | "shipped";

/**
 * 出荷明細（どの在庫から何個出荷するか）
 */
export type ShipmentDetail = {
  orderDetailId: number;
  inventoryId: number;
  shippedQuantity: number;
};

export type Shipment = {
  orderId: number;
  shippedAt: Date;
  shipmentDetails: ShipmentDetail[];
};
