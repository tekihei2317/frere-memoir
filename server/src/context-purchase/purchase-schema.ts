import { z } from "zod";
import { DateString } from "../utils/zod-schema";

const PurchaseDetail = z.object({
  flowerId: z.number(),
  orderQuantity: z.number().min(0),
});

export const CreatePurchaseInput = z.object({
  deliveryDate: DateString,
  details: z.array(PurchaseDetail).min(1),
});

export type CreatePurchaseInput = z.infer<typeof CreatePurchaseInput>;

export const ChangeDeliveryDateInput = z.object({
  purchaseId: z.number(),
  deliveryDate: DateString,
});
