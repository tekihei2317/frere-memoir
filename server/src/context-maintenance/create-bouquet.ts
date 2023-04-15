import { prisma } from "../database/prisma";
import { adminProcedure } from "../trpc/initialize";
import { CreateBouquetInput } from "./api-schema";
import { Bouquet } from "./core/types";

async function validateCreateBouquetInput(input: CreateBouquetInput): Promise<CreateBouquetInput> {
  return input;
}

function persistBouquet(input: CreateBouquetInput): Promise<Bouquet> {
  return prisma.bouquet.create({
    data: {
      bouquetCode: input.bouquetCode,
      name: input.name,
      bouquetDetails: {
        createMany: {
          data: input.bouquetDetails,
        },
      },
    },
    include: {
      bouquetDetails: { include: { flower: true } },
    },
  });
}

export const createBouquet = adminProcedure.input(CreateBouquetInput).mutation(async ({ input }) => {
  const validatedInput = await validateCreateBouquetInput(input);
  const bouquet = await persistBouquet(validatedInput);
  return bouquet;
});
