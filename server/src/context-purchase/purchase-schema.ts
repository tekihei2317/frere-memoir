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

export const PurchaseIdInput = z.object({
  purchaseId: z.number(),
});

export type PurchaseIdInput = z.infer<typeof PurchaseIdInput>;

export const ArrivalDetailInput = z.object({
  orderDetailId: z.number(),
  arrivedCount: z.number().min(0),
});

export const RegisterArrivalInformationInput = z.object({
  purchaseId: z.number(),
  arrivalDetails: z.array(ArrivalDetailInput),
});

export type RegisterArrivalInformationInput = z.infer<typeof RegisterArrivalInformationInput>;
