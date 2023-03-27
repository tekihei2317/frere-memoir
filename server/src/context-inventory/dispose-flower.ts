import { adminProcedure, notFoundError } from "../trpc/initialize";
import { prisma } from "../database/prisma";
import { DisposeFlowerInput } from "./api-schema";
import { DisposeFlowerWorkflow } from "./types";
import { TRPCError } from "@trpc/server";

type Workflow = DisposeFlowerWorkflow<DisposeFlowerInput>;
type Deps = Workflow["deps"];

async function disposeFlowerWorkflow(input: Workflow["input"], deps: Workflow["deps"]): Workflow["output"] {
  const validatedInput = await deps.validateDisposeFlowerInput(input);
  const flowerDisposal = await deps.persistFlowerDisposal(validatedInput);
  await deps.updateFlowerInventory(flowerDisposal);

  return flowerDisposal;
}

const validateDisposeFlowerInput: Deps["validateDisposeFlowerInput"] = async (input) => {
  // 在庫IDが正しいこと
  const inventory = await prisma.flowerInventory.findUnique({ where: { id: input.flowerInventoryId } });
  if (inventory === null) throw notFoundError;

  // 在庫数を超えていないこと
  if (input.disposedCount > inventory.currentQuantity) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `破棄数は${inventory.currentQuantity}以下を指定してください` });
  }

  return input;
};

const persistFlowerDisposal: Deps["persistFlowerDisposal"] = async (input) => {
  return prisma.flowerDisposal.create({
    data: {
      flowerInventoryId: input.flowerInventoryId,
      disposedCount: input.disposedCount,
    },
  });
};

const updateFlowerInventory: Deps["updateFlowerInventory"] = async (flowerDisposal) => {
  return prisma.flowerInventory.update({
    where: { id: flowerDisposal.flowerInventoryId },
    data: {
      currentQuantity: { decrement: flowerDisposal.disposedCount },
    },
  });
};

export const disposeFlower = adminProcedure.input(DisposeFlowerInput).mutation(async ({ input }) => {
  return disposeFlowerWorkflow(input, {
    validateDisposeFlowerInput,
    persistFlowerDisposal,
    updateFlowerInventory,
  });
});
