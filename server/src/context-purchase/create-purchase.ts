import { TRPCError } from "@trpc/server";
import { adminProcedure } from "../trpc/initialize";
import { CreatePurchaseInput } from "./purchase-schema";
import { CreatePurchaseWorkflow } from "./purchase-types";

type Workflow = CreatePurchaseWorkflow<CreatePurchaseInput>;

async function createPurchaseWorkflow(input: Workflow["input"], deps: Workflow["deps"]): Workflow["output"] {
  const purchase = await deps.fetchFlowers(input);

  if (!deps.checkIfDeliverable(purchase)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "納品希望日は、発注リードタイムより後の日付を入力してください",
    });
  }

  // TODO: トランザクションを使う or メールをキューで送信する
  const createdPurchase = await deps.persistPurchase(purchase);
  await deps.sendPurchaseEmail(createdPurchase);

  return createdPurchase;
}

type Deps = Workflow["deps"];

const checkIfDeliverable: Deps["checkIfDeliverable"] = () => {
  return true;
};

export const createPurchase = adminProcedure.input(CreatePurchaseInput).mutation(async ({ ctx, input }) => {
  const fetchFlowers: Deps["fetchFlowers"] = async (input) => {
    const flowerIds = input.details.map((detail) => detail.flowerId);
    const flowers = await ctx.prisma.flower.findMany({ where: { id: { in: flowerIds } } });
    const flowerMap = new Map(flowers.map((flower) => [flower.id, flower]));

    return {
      purchaseNumber: "",
      deliveryDate: input.deliveryDate,
      orderDetails: input.details.map((detail) => {
        const flower = flowerMap.get(detail.flowerId);
        if (flower === undefined) throw new TRPCError({ code: "BAD_REQUEST", message: "選択した花が存在しません" });

        return { ...detail, flower };
      }),
    };
  };

  const persistPurchase: Deps["persistPurchase"] = async (purchase) => {
    const createdPurchase = await ctx.prisma.flowerOrder.create({
      data: {
        purchaseNumber: purchase.purchaseNumber,
        deliveryDate: purchase.deliveryDate,
        orderDetails: {
          createMany: {
            data: purchase.orderDetails.map((detail) => ({
              flowerId: detail.flower.id,
              orderQuantity: detail.orderQuantity,
            })),
          },
        },
      },
      include: {
        orderDetails: { include: { flower: true } },
      },
    });

    return createdPurchase;
  };

  const sendPurchaseEmail: Deps["sendPurchaseEmail"] = async () => {};

  return createPurchaseWorkflow(input, {
    fetchFlowers,
    checkIfDeliverable,
    persistPurchase,
    sendPurchaseEmail,
  });
});
