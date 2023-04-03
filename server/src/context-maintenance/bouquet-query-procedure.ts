import { adminProcedure, notFoundError, protectedProcedure } from "../trpc/initialize";
import { BouquetIdInput } from "./api-schema";

export const getBouquets = protectedProcedure.query(({ ctx }) => {
  return ctx.prisma.bouquet.findMany({ select: { id: true, bouquetCode: true, name: true } });
});

export const getBouquet = adminProcedure.input(BouquetIdInput).query(async ({ ctx, input }) => {
  const flower = await ctx.prisma.bouquet.findUnique({
    where: { id: input.bouquetId },
    include: {
      bouquetDetails: {
        include: {
          flower: {
            select: { id: true, name: true, flowerCode: true },
          },
        },
      },
    },
  });
  if (flower === null) throw notFoundError;

  return flower;
});
