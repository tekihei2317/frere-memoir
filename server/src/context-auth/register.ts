import { TRPCError } from "@trpc/server";
import { prisma } from "../database/prisma";
import { publicProcedure } from "../trpc/initialize";
import { RegisterInput } from "./api-schema";
import { RegisterWorkflow } from "./core/types";

type Workflow = RegisterWorkflow<RegisterInput>;

async function registerWorkflow(input: Workflow["input"], deps: Workflow["deps"]): Workflow["output"] {
  const validatedInput = await deps.validateRegisterInput(input);
  const customer = await deps.persistCustomer(validatedInput);
  await deps.sendVerificationEmail(customer);

  return customer;
}

type Deps = Workflow["deps"];

const validateRegisterInput: Deps["validateRegisterInput"] = async (input) => {
  const isEmailUsed = (await prisma.customerCredential.findUnique({ where: { email: input.email } })) !== null;
  if (isEmailUsed) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "メールアドレスが既に使用されています" });
  }

  return input;
};

const persistCustomer: Deps["persistCustomer"] = async (input) => {
  const customer = await prisma.customer.create({
    data: {
      name: input.name,
      customerCredential: {
        create: {
          email: input.email,
          password: input.password,
          isEmailVerified: false,
        },
      },
    },
    include: { customerCredential: true },
  });

  return { name: customer.name, email: customer.customerCredential.email };
};

const sendVerificationEmail: Deps["sendVerificationEmail"] = async (customer) => {};

export const register = publicProcedure
  .input(RegisterInput)
  .mutation(({ input }) => registerWorkflow(input, { validateRegisterInput, persistCustomer, sendVerificationEmail }));
