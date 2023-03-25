import { TRPCError } from "@trpc/server";
import { RegisterArrivalInformationInput } from "./purchase-schema";
import { RegisterArrivalInformationWorkflow } from "./purchase-types";
import { adminProcedure, notFoundError } from "../trpc/initialize";
import { prisma } from "../database/prisma";

type Workflow = RegisterArrivalInformationWorkflow<RegisterArrivalInformationInput>;

async function registerArrivalInformationWorkFlow(
  input: Workflow["input"],
  deps: Workflow["deps"]
): Workflow["output"] {
  const purchase = await deps.findPurchaseById(input.purchaseId);
  const arrival = await deps.validateArrivalInformation({
    arrival: input,
    purchase,
    validateArrivalDetails: deps.validateArrivalDetails,
  });

  await deps.persistArrivalInformation(arrival);
}

type Deps = Workflow["deps"];

const findPurchaseById: Deps["findPurchaseById"] = async (purchaseId) => {
  const purchase = await prisma.flowerOrder.findUnique({
    where: { id: purchaseId },
    include: {
      orderDetails: { include: { flower: true } },
    },
  });
  if (purchase === null) throw notFoundError;

  return purchase;
};

const validateArrivalDetails: Deps["validateArrivalDetails"] = async (arrivalDetails) => {
  const orderDetailIds = arrivalDetails.map((detail) => detail.orderDetailId);
  const uniqueOrderDetailIds = [...new Set(orderDetailIds)];

  if (orderDetailIds.length > uniqueOrderDetailIds.length) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "仕入れ明細IDが重複しています" });
  }

  // ここでIOしない方がよさそう
  const orderDetails = await prisma.flowerOrderDetail.findMany({ where: { id: { in: uniqueOrderDetailIds } } });
  if (orderDetails.length < arrivalDetails.length) {
    // 仕入れ明細IDに、データベースに存在しないものがある
    throw new TRPCError({ code: "BAD_REQUEST", message: "仕入れ明細IDが正しくありません" });
  }
  if (arrivalDetails.length < orderDetails.length) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "入荷明細が不足しています" });
  }

  const orderDetailsMap = new Map(orderDetails.map((detail) => [detail.id, detail]));

  return arrivalDetails.map((detail) => ({ ...detail, orderDetail: orderDetailsMap.get(detail.orderDetailId)! }));
};

const validateArrivalInformation: Deps["validateArrivalInformation"] = async ({
  arrival,
  purchase,
  validateArrivalDetails,
}) => {
  const validatedArrivalDetails = await validateArrivalDetails(arrival.arrivalDetails, purchase);

  return {
    purchaseId: arrival.purchaseId,
    arrivedAt: new Date(),
    arrivalDetails: validatedArrivalDetails,
  };
};

const persistArrivalInformation: Deps["persistArrivalInformation"] = async (arrivalInfo) => {
  // 在庫を作成する
  const inventories = await Promise.all(
    arrivalInfo.arrivalDetails.map(async (detail) => {
      const inventory = await prisma.flowerInventory.upsert({
        where: {
          flowerId_arrivalDate: {
            flowerId: detail.orderDetail.flowerId,
            arrivalDate: arrivalInfo.arrivedAt,
          },
        },
        create: {
          flowerId: detail.orderDetail.flowerId,
          arrivalDate: arrivalInfo.arrivedAt,
          currentQuantity: detail.arrivedCount,
        },
        update: {
          currentQuantity: { increment: detail.arrivedCount },
        },
      });

      return inventory;
    })
  );

  // 入荷情報を登録する
  const inventoryMap = new Map(inventories.map((inventory) => [inventory.flowerId, inventory]));
  await prisma.flowerOrderArrival.create({
    data: {
      flowerOrderId: arrivalInfo.purchaseId,
      arrivedAt: arrivalInfo.arrivedAt,
      orderDetailArrivals: {
        createMany: {
          data: arrivalInfo.arrivalDetails.map((detail) => ({
            flowerOrderDetailId: detail.orderDetail.id,
            arrivedQuantity: detail.arrivedCount,
            flowerInventoryId: inventoryMap.get(detail.orderDetail.flowerId)!.id,
          })),
        },
      },
    },
  });
};

export const registerArrivalInformation = adminProcedure
  .input(RegisterArrivalInformationInput)
  .mutation(async ({ input }) => {
    return registerArrivalInformationWorkFlow(input, {
      findPurchaseById,
      validateArrivalDetails,
      validateArrivalInformation,
      persistArrivalInformation,
    });
  });
