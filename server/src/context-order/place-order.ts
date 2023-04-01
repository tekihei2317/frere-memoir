import { TRPCError } from "@trpc/server";
import { customerProcedure } from "../trpc/initialize";
import { PlaceOrderForm } from "./api-schema";
import { PlacedOrder, ValidatedOrder } from "./core/types";
import { prisma } from "../database/prisma";
import { addDays, startOfDay } from "date-fns";
import { Customer } from "../context-auth/public-types";

function validateOrderForm(orderForm: PlaceOrderForm, customer: Customer): ValidatedOrder {
  return {
    ...orderForm,
    customerId: customer.id,
    totalAmount: 0, // TODO:
    orderDetails: [], // TODO:
  };
}

async function checkStock(order: ValidatedOrder): Promise<boolean> {
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
}

async function persistOrder(order: ValidatedOrder): Promise<PlacedOrder> {
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
}

async function processPayment(order: PlacedOrder): Promise<void> {}

export const placeOrder = customerProcedure.input(PlaceOrderForm).mutation(async ({ input, ctx }) => {
  const validatedOrder = await validateOrderForm(input, ctx.user);
  if (!(await checkStock(validatedOrder))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "在庫が不足しているため、指定したお届け日にお届けできません。",
    });
  }

  const placedOrder = await persistOrder(validatedOrder);
  await processPayment(placedOrder);

  return placedOrder;
});
