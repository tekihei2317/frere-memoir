import { z } from "zod";

export const FlowerId = z.number();

export const FlowerIdInput = z.object({ flowerId: FlowerId });

export const CreateFlowerInput = z.object({
  flowerCode: z.string(),
  name: z.string(),
  deliveryDays: z.number(),
  purchaseQuantity: z.number(),
  maintanableDays: z.number(),
});

export const UpdateFlowerInput = z
  .object({
    id: FlowerId,
  })
  .merge(CreateFlowerInput);

export const BouquetIdInput = z.object({ bouquetId: z.number() });

export const BouquetDetailInput = z.object({
  flowerId: z.number(),
  flowerQuantity: z.number(),
});

export const CreateBouquetInput = z.object({
  bouquetCode: z.string().min(1),
  name: z.string().min(1),
  bouquetDetails: z.array(BouquetDetailInput).min(1),
});
export type CreateBouquetInput = z.infer<typeof CreateBouquetInput>;
