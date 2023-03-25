import { adminProcedure, notFoundError } from "../trpc/initialize";
import { PurchaseIdInput } from "./purchase-schema";
import { CancelPurchaseWorkflow } from "./purchase-types";

type Workflow = CancelPurchaseWorkflow<PurchaseIdInput>;

async function cancelPurchaseWorkflow(input: Workflow["input"], deps: Workflow["deps"]): Workflow["output"] {
  const purchase = await deps.findUndeliveredPurchase(input.purchaseId);

  // TODO: トランザクション
  await deps.deletePurchase(purchase);
  await deps.sendCancelPurchaseEmail(purchase);
}

export const cancelPurchase = adminProcedure.input(PurchaseIdInput).mutation(async ({ ctx, input }) => {
  type Deps = Workflow["deps"];

  const findUndeliveredPurchase: Deps["findUndeliveredPurchase"] = async (purchaseId) => {
    const purchase = await ctx.prisma.flowerOrder.findFirst({
      where: { id: purchaseId, arrivedEvent: null },
      include: { orderDetails: { include: { flower: true } } },
    });
    if (purchase === null) throw notFoundError;

    return purchase;
  };

  // スタブ
  const sendCancelPurchaseEmail: Deps["sendCancelPurchaseEmail"] = async () => {};

  const deletePurchase: Deps["deletePurchase"] = async (purchase) => {
    await ctx.prisma.flowerOrderDetail.deleteMany({ where: { flowerOrderId: purchase.id } });
    await ctx.prisma.flowerOrder.delete({ where: { id: purchase.id } });
  };

  return cancelPurchaseWorkflow(input, {
    findUndeliveredPurchase,
    sendCancelPurchaseEmail,
    deletePurchase,
  });
});
