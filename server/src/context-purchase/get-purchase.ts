import { z } from "zod";
import { adminProcedure, notFoundError } from "../trpc/initialize";

export const getPurchase = adminProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
  const purchase = await ctx.prisma.flowerOrder.findUnique({
    where: { id: input.id },
    include: {
      orderDetails: { include: { flower: true } },
      arrivedEvent: true,
    },
  });
  if (purchase === null) throw notFoundError;

  return {
    ...purchase,
    status: purchase.arrivedEvent === null ? "発注済み" : "到着済み",
  };
});
