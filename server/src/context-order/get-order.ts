import { adminProcedure, notFoundError } from "../trpc/initialize";
import { OrderIdInput } from "./api-schema";
import { getOrderStatus } from "./core/order-logic";

export const getOrder = adminProcedure.input(OrderIdInput).query(async ({ ctx, input }) => {
  const order = await ctx.prisma.bouquetOrder.findUnique({
    where: { id: input.orderId },
    select: {
      id: true,
      bouquet: { select: { id: true, name: true } },
      customer: { select: { name: true } },
      deliveryDate: true,
      senderName: true,
      deliveryAddress1: true,
      deliveryAddress2: true,
      deliveryMessage: true,
      shipment: true,
    },
  });
  if (order === null) throw notFoundError;

  return {
    ...order,
    status: getOrderStatus(order),
  };
});
