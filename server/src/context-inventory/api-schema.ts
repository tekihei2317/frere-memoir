import { z } from "zod";

export const DisposeFlowerInput = z.object({
  flowerInventoryId: z.number(),
  disposedCount: z.number().min(1),
});

export type DisposeFlowerInput = z.infer<typeof DisposeFlowerInput>;
