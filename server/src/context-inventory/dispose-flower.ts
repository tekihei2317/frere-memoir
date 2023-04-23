import { adminProcedure, notFoundError } from "../trpc/initialize";
import { prisma } from "../database/prisma";
import { DisposeFlowerInput } from "./api-schema";
import { TRPCError } from "@trpc/server";
import { FlowerDisposal, FlowerInventory } from "./core/types";

async function validateDisposeFlowerInput(input: DisposeFlowerInput): Promise<DisposeFlowerInput> {
  // 在庫IDが正しいこと
  const inventory = await prisma.flowerInventory.findUnique({ where: { id: input.flowerInventoryId } });
  if (inventory === null) throw notFoundError;

  // 在庫数を超えていないこと
  if (input.disposedCount > inventory.currentQuantity) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `破棄数は${inventory.currentQuantity}以下を指定してください` });
  }

  return input;
}

async function persistFlowerDisposal(input: DisposeFlowerInput): Promise<FlowerDisposal> {
  return prisma.flowerDisposal.create({
    data: {
      flowerInventoryId: input.flowerInventoryId,
      disposedCount: input.disposedCount,
    },
  });
}

async function updateFlowerInventory(flowerDisposal: FlowerDisposal): Promise<FlowerInventory> {
  return prisma.flowerInventory.update({
    where: { id: flowerDisposal.flowerInventoryId },
    data: {
      currentQuantity: { decrement: flowerDisposal.disposedCount },
    },
  });
}

export const disposeFlower = adminProcedure.input(DisposeFlowerInput).mutation(async ({ input }) => {
  const validatedInput = await validateDisposeFlowerInput(input);
  const flowerDisposal = await persistFlowerDisposal(validatedInput);
  await updateFlowerInventory(flowerDisposal);

  return flowerDisposal;
});
