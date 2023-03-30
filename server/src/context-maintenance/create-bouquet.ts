import { prisma } from "../database/prisma";
import { adminProcedure } from "../trpc/initialize";
import { WorkflowSteps } from "../utils/workflow";
import { CreateBouquetInput } from "./api-schema";
import { CreateBouquetWorkflow } from "./core/types";

type Workflow = CreateBouquetWorkflow<CreateBouquetInput>;

const createBouquetWorkflow: Workflow = async ({ input, steps }) => {
  const validatedInput = await steps.validateCreateBouquetInput(input);
  const bouquet = await steps.persistBouquet(validatedInput);
  return bouquet;
};

type Steps = WorkflowSteps<Workflow>;

const validateCreateBouquetInput: Steps["validateCreateBouquetInput"] = async (input) => {
  return input;
};

const persistBouquet: Steps["persistBouquet"] = (input) => {
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
};

export const createBouquet = adminProcedure
  .input(CreateBouquetInput)
  .mutation(async ({ input }) =>
    createBouquetWorkflow({ input, steps: { validateCreateBouquetInput, persistBouquet } })
  );
