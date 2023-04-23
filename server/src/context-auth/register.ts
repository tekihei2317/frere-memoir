import { TRPCError } from "@trpc/server";
import { prisma } from "../database/prisma";
import { publicProcedure } from "../trpc/initialize";
import { makeHash } from "../utils/hash";
import { RegisterInput } from "./api-schema";
import { Customer } from "./core/types";

async function validateRegisterInput(input: RegisterInput): Promise<RegisterInput> {
  const isEmailUsed = (await prisma.customerCredential.findUnique({ where: { email: input.email } })) !== null;
  if (isEmailUsed) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "メールアドレスが既に使用されています" });
  }

  return input;
}

async function persistCustomer(input: RegisterInput): Promise<Customer> {
  const customer = await prisma.customer.create({
    data: {
      name: input.name,
      customerCredential: {
        create: {
          email: input.email,
          password: makeHash(input.password),
          isEmailVerified: false,
        },
      },
    },
    include: { customerCredential: true },
  });

  return { id: customer.id, name: customer.name, email: customer.customerCredential.email };
}

async function sendVerificationEmail(customer: Customer): Promise<void> {}

/**
 * 顧客のユーザー登録をする
 */
export const register = publicProcedure.input(RegisterInput).mutation(async ({ input }) => {
  const validatedInput = await validateRegisterInput(input);
  const customer = await persistCustomer(validatedInput);
  await sendVerificationEmail(customer);

  return customer;
});
