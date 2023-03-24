import { adminProcedure } from "../trpc/initialize";

export const getPurchases = adminProcedure.query(async ({ ctx }) => {
  const purchases = await ctx.prisma.flowerOrder.findMany({
    select: {
      id: true,
      deliveryDate: true,
      purchaseNumber: true,
      arrivedEvent: true,
    },
  });

  return purchases.map((purchase) => ({
    ...purchase,
    status: purchase.arrivedEvent === null ? "発注済み" : "到着済み",
  }));
});
