import { adminProcedure } from "../trpc/initialize";
import { GetOrdersInput } from "./api-schema";
import { getOrderStatus } from "./core/order-logic";

export const getOrders = adminProcedure.input(GetOrdersInput).query(async ({ ctx, input }) => {
  const orders = await ctx.prisma.bouquetOrder.paginate({
    page: 1,
    perPage: 20,
    select: {
      id: true,
      bouquet: { select: { id: true, name: true } },
      customer: { select: { name: true } },
      deliveryDate: true,
      shipment: true,
    },
    where: {
      shipment: input.status === undefined ? undefined : input.status === "placed" ? { is: null } : { isNot: null },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await ctx.prisma.bouquetOrder.findMany({
    where: {
      shipment: { isNot: null },
    },
  });

  return {
    ...orders,
    items: orders.items.map((item) => ({ ...item, status: getOrderStatus(item) })),
  };
});
