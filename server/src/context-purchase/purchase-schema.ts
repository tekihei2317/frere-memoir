import { z } from "zod";

const PurchaseDetail = z.object({
  flowerId: z.number(),
  orderQuantity: z.number().min(0),
});

export const CreatePurchaseInput = z.object({
  deliveryDate: z.date(),
  details: z.array(PurchaseDetail).min(1),
});

export type CreatePurchaseInput = z.infer<typeof CreatePurchaseInput>;
