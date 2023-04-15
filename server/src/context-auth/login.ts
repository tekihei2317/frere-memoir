import { publicProcedure } from "../trpc/initialize";
import { LoginInput } from "./api-schema";
import { IronSession } from "iron-session";
import { TRPCError } from "@trpc/server";
import { env } from "../utils/env";
import { prisma } from "../database/prisma";
import { compareHash } from "../utils/hash";
import { FrereUser } from "./core/types";

async function validateLoginInput(input: LoginInput): Promise<FrereUser> {
  const invalidCredentialsError = new TRPCError({ code: "BAD_REQUEST", message: "ログイン情報が正しくありません" });

  if (input.type === "admin") {
    if (input.email === env.ADMIN_EMAIL && input.password === env.ADMIN_PASSWORD) return input;
    else throw invalidCredentialsError;
  }

  // メールアドレスが正しいか
  const credential = await prisma.customerCredential.findUnique({
    where: { email: input.email },
    include: { customer: true },
  });
  if (credential === null || credential.customer === null) throw invalidCredentialsError;

  // メールアドレスが認証されているか
  if (!credential.isEmailVerified) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "メールアドレスを認証してください" });
  }

  // パスワードが正しいか
  if (!compareHash(input.password, credential.password)) {
    throw invalidCredentialsError;
  }

  return { type: "customer", id: credential.customer.id, email: credential.email, name: credential.customer.name };
}

async function saveUserToSession(session: IronSession, user: FrereUser): Promise<void> {
  session.user = user;
  await session.save();
}

/**
 * ログインする
 */
export const login = publicProcedure.input(LoginInput).mutation(async ({ ctx, input }) => {
  const user = await validateLoginInput(input);
  await saveUserToSession(ctx.session, user);

  return user;
});
