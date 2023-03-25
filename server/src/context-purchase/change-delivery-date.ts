import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, notFoundError } from "../trpc/initialize";
import { ChangeDeliveryDateInput } from "./api-schema";
import { ChangeDeliveryDateWorkflow, CreatedPurchase } from "./types";
import { checkIfDeliverable } from "./purchase-util";

type Workflow = ChangeDeliveryDateWorkflow<z.infer<typeof ChangeDeliveryDateInput>>;

async function changeDeliveryDateWorkflow(input: Workflow["input"], deps: Workflow["deps"]): Workflow["output"] {
  const purchase = await deps.findPurchaseById(input.purchaseId);
  const updatedPurchase: CreatedPurchase = { ...purchase, deliveryDate: new Date(input.deliveryDate) };

  if (!deps.checkIfDeliverable(updatedPurchase)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "納品希望日は、発注リードタイムより後の日付を入力してください",
    });
  }
  await deps.updateDeliveryDate(updatedPurchase);

  return purchase;
}

export const changeDeliveryDate = adminProcedure.input(ChangeDeliveryDateInput).mutation(async ({ ctx, input }) => {
  type Deps = Workflow["deps"];

  const findPurchaseById: Deps["findPurchaseById"] = async (purchaseId) => {
    const purchase = await ctx.prisma.flowerOrder.findUnique({
      where: { id: purchaseId },
      include: {
        orderDetails: { include: { flower: true } },
      },
    });
    if (purchase === null) throw notFoundError;

    return purchase;
  };

  const updateDeliveryDate: Deps["updateDeliveryDate"] = async (purchase) => {
    await ctx.prisma.flowerOrder.update({
      where: { id: purchase.id },
      data: { deliveryDate: purchase.deliveryDate },
    });
  };

  return changeDeliveryDateWorkflow(input, { findPurchaseById, checkIfDeliverable, updateDeliveryDate });
});
