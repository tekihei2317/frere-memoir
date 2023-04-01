import { prisma } from "../../database/prisma";
import { notFoundError } from "../../trpc/initialize";
import { FindPlacedOrder } from "../core/types";

export const findPlacedOrder: FindPlacedOrder = async (orderId) => {
  const order = await prisma.bouquetOrder.findFirst({
    where: { id: orderId, shipment: null },
  });
  if (order === null) throw notFoundError;

  return order;
};
