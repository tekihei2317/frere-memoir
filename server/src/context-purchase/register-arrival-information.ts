import { TRPCError } from "@trpc/server";
import { adminProcedure, notFoundError } from "../trpc/initialize";
import { RegisterArrivalInformationInput } from "./purchase-schema";
import { RegisterArrivalInformationWorkflow } from "./purchase-types";

type Workflow = RegisterArrivalInformationWorkflow<RegisterArrivalInformationInput>;

async function registerArrivalInformationWorkFlow(
  input: Workflow["input"],
  deps: Workflow["deps"]
): Workflow["output"] {
  const purchase = await deps.findPurchaseById(input.purchaseId);
  const validatedInput = await deps.validateArrivalInformation(input, purchase);

  await deps.persistArrivalInformation(validatedInput);
}

export const registerArrivalInformation = adminProcedure
  .input(RegisterArrivalInformationInput)
  .mutation(async ({ ctx, input }) => {
    type Deps = Workflow["deps"];

    async function checkAllOrderDetailIdExists(uniqueOrderDetailIds: number[]): Promise<boolean> {
      const count = await ctx.prisma.flowerOrderDetail.count({ where: { id: { in: uniqueOrderDetailIds } } });
      return count === uniqueOrderDetailIds.length;
    }

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

    const validateArrivalInformation: Deps["validateArrivalInformation"] = async (arrivalInfo, purchase) => {
      const orderDetailIds = arrivalInfo.arrivalDetails.map((detail) => detail.orderDetailId);
      const uniqueOrderDetailIds = [...new Set(orderDetailIds)];

      if (orderDetailIds.length > uniqueOrderDetailIds.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "仕入れ明細IDが重複しています" });
      }

      if (!(await checkAllOrderDetailIdExists(uniqueOrderDetailIds))) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "仕入れ明細IDが正しくありません" });
      }

      if (uniqueOrderDetailIds.length < purchase.orderDetails.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "入荷明細が不足しています" });
      }

      return arrivalInfo;
    };

    // スタブ
    const persistArrivalInformation: Deps["persistArrivalInformation"] = async () => {};

    return registerArrivalInformationWorkFlow(input, {
      findPurchaseById,
      validateArrivalInformation,
      persistArrivalInformation,
    });
  });
