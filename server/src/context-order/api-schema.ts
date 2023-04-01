import { z } from "zod";

export const PlaceOrderForm = z.object({
  bouquetId: z.number(),
  deliveryDate: z.date(),
  senderName: z.string().min(1),
  deliveryAddress1: z.string().min(1),
  deliveryAddress2: z.string().optional(),
  deliveryMessage: z.string().optional(),
});
export type PlaceOrderForm = z.infer<typeof PlaceOrderForm>;

export const OrderIdInput = z.object({
  orderId: z.number(),
});

export const ChangeOrderDeliveryDateInput = OrderIdInput.extend({
  deliveryDate: z.date(),
});
