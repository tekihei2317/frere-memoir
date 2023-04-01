import { customerProcedure } from "../trpc/initialize";

export const getOrderHistories = customerProcedure.query(async ({ ctx }) => {
  const orders = await ctx.prisma.bouquetOrder.findMany({
    where: { customerId: ctx.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, totalAmount: true, createdAt: true, bouquet: { select: { name: true } }, shipment: true },
  });

  type OrderStatus = "placed" | "shipped";

  return orders.map((order) => {
    const status: OrderStatus = order.shipment === null ? "placed" : "shipped";
    return { ...order, status };
  });
});
