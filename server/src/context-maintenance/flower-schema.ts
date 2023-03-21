import { z } from "zod";

export const FlowerId = z.number();

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
