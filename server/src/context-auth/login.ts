import { publicProcedure } from "../trpc/initialize";
import { LoginInput } from "./api-schema";
import { LoginWorkflow } from "./core/types";
import { IronSession } from "iron-session";
import { TRPCError } from "@trpc/server";
import { env } from "../utils/env";
import { prisma } from "../database/prisma";
import { compareHash } from "../utils/hash";

type Workflow = LoginWorkflow<LoginInput>;

async function loginWorkflow(input: Workflow["input"], deps: Workflow["deps"]): Workflow["output"] {
  const user = await deps.validateLoginInput(input);
  await deps.saveUserToSession(user);

  return user;
}

type Deps = Workflow["deps"];

const validateLoginInput: Deps["validateLoginInput"] = async (input) => {
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

  return { type: "customer", email: credential.email, name: credential.customer.name };
};

function saveUserToSession(session: IronSession) {
  const inner: Deps["saveUserToSession"] = async (user) => {
    session.user = user;
    await session.save();
  };

  return inner;
}

export const login = publicProcedure.input(LoginInput).mutation(({ ctx, input }) =>
  loginWorkflow(input, {
    validateLoginInput: validateLoginInput,
    saveUserToSession: saveUserToSession(ctx.session),
  })
);
