import { prisma } from "../../database/prisma";
import { Bouquet } from "../core/types";

export async function findBouquet(bouquetId: number): Promise<Bouquet | null> {
  return prisma.bouquet.findUnique({
    where: { id: bouquetId },
    include: { bouquetDetails: { include: { flower: true } } },
  });
}
