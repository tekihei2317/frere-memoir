import { prisma } from "../database/prisma";
import { customerProcedure, notFoundError } from "../trpc/initialize";
import { OrderIdInput } from "./api-schema";
import { PlacedOrder } from "./core/types";

async function findPlacedOrder(orderId: number): Promise<PlacedOrder> {
  const order = await prisma.bouquetOrder.findFirst({
    where: { id: orderId, shipment: null },
  });
  if (order === null) throw notFoundError;

  return order;
}

async function deletePlacedOrder(order: PlacedOrder): Promise<void> {
  await prisma.bouquetOrder.delete({ where: { id: order.id } });
}

async function processRefund(order: PlacedOrder): Promise<void> {}

export const cancelOrder = customerProcedure.input(OrderIdInput).mutation(async ({ input }) => {
  const order = await findPlacedOrder(input.orderId);
  await deletePlacedOrder(order);
  await processRefund(order);
});
