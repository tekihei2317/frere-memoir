import { TRPCError } from "@trpc/server";
import { customerProcedure } from "../trpc/initialize";
import { PlaceOrderForm } from "./api-schema";
import { PlaceOrderWorkflow } from "./core/types";
import { WorkflowSteps } from "../utils/workflow";
import { prisma } from "../database/prisma";
import { addDays, startOfDay } from "date-fns";

type Workflow = PlaceOrderWorkflow<PlaceOrderForm>;

const placeOrderWorkflow: Workflow = async ({ input, steps }) => {
  const validatedOrder = await steps.validateOrderForm(input.form, input.customer);
  if (!(await steps.checkStock(validatedOrder))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "在庫が不足しているため、指定したお届け日にお届けできません。",
    });
  }

  const placedOrder = await steps.persistOrder(validatedOrder);
  await steps.processPayment(placedOrder);

  return placedOrder;
};

type Steps = WorkflowSteps<Workflow>;

const validateOrderForm: Steps["validateOrderForm"] = async (orderForm, customer) => {
  return {
    ...orderForm,
    customerId: customer.id,
    totalAmount: 0, // TODO:
    orderDetails: [], // TODO:
  };
};

const checkStock: Steps["checkStock"] = async (order) => {
  for (const detail of order.orderDetails) {
    // お届け日が最速入荷日（今日＋発注リードタイム）より前の場合は、現在の在庫で足りるかを確認する
    const isBeforeFastestArrivalDate =
      startOfDay(order.deliveryDate) <= addDays(startOfDay(new Date()), detail.flower.deliveryDays);

    if (isBeforeFastestArrivalDate) {
      // 一旦、在庫が不足している場合は注文できないことにする
      return false;
    } else {
      // そうでない場合は、今日発注することで間に合わせられる。現在の在庫で足りない場合は、通知をするとよさそう。
    }
  }

  return true;
};

const persistOrder: Steps["persistOrder"] = (order) => {
  return prisma.bouquetOrder.create({
    data: {
      customerId: order.customerId,
      senderName: order.senderName,
      bouquetId: order.bouquetId,
      deliveryDate: order.deliveryDate,
      deliveryAddress1: order.deliveryAddress1,
      deliveryAddress2: order.deliveryAddress2,
      deliveryMessage: order.deliveryMessage,
      totalAmount: order.totalAmount,
      orderDetails: {
        createMany: {
          data: order.orderDetails.map(({ flower }) => ({
            flowerId: flower.id,
            flowerCode: flower.flowerCode,
            flowerName: flower.name,
          })),
        },
      },
    },
  });
};

const processPayment: Steps["processPayment"] = async () => {};

export const placeOrder = customerProcedure.input(PlaceOrderForm).mutation(async ({ input, ctx }) =>
  placeOrderWorkflow({
    input: { form: input, customer: ctx.user },
    steps: {
      validateOrderForm,
      checkStock,
      persistOrder,
      processPayment,
    },
  })
);
