import { TRPCError } from "@trpc/server";
import { prisma } from "../database/prisma";
import { customerProcedure } from "../trpc/initialize";
import { ChangeOrderDeliveryDateInput } from "./api-schema";
import { findPlacedOrder } from "./persistence/order-query";
import { PlacedOrder } from "./core/types";

async function checkStock(order: PlacedOrder): Promise<boolean> {
  return true;
}

async function updateDeliveryDate(order: PlacedOrder): Promise<void> {
  await prisma.bouquetOrder.update({
    where: { id: order.id },
    data: { deliveryDate: order.deliveryDate },
  });
}

export const changeDeliveryDate = customerProcedure.input(ChangeOrderDeliveryDateInput).mutation(async ({ input }) => {
  const order = await findPlacedOrder(input.orderId);
  const newOrder: PlacedOrder = { ...order, deliveryDate: input.deliveryDate };

  if (!(await checkStock(order))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "在庫が不足しているため、指定したお届け日にお届けできません。",
    });
  }
  await updateDeliveryDate(newOrder);

  return newOrder;
});
