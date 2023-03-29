import { initTRPC, TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { getIronSession, IronSessionOptions } from "iron-session";
import { prisma } from "../database/prisma";
import { env } from "../utils/env";
import { FrereUser } from "../context-auth/core/types";

declare module "iron-session" {
  interface IronSessionData {
    user: FrereUser | undefined;
  }
}

const sessionOptions: IronSessionOptions = {
  cookieName: "frere_memoir",
  password: env.COOKIE_PASSWORD,
  cookieOptions: {
    secure: false,
  },
};

export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await getIronSession(req, res, sessionOptions);
  const user = session.user;

  return { prisma, session, user };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
export const router = t.router;
export const mergeRouters = t.mergeRouters;

export const authenticationError = new TRPCError({ code: "UNAUTHORIZED", message: "ログインしてください" });
export const authorizationError = new TRPCError({ code: "FORBIDDEN", message: "権限がありません" });
export const notFoundError = new TRPCError({ code: "NOT_FOUND", message: "データが見つかりませんでした" });

const ensureLoggedIn = t.middleware(({ ctx, next }) => {
  if (ctx.user === undefined) throw authenticationError;

  return next({ ctx: { ...ctx, user: ctx.user } });
});

const ensureUserIsCustomer = ensureLoggedIn.unstable_pipe(({ ctx, next }) => {
  if (ctx.user.type !== "customer") throw authorizationError;

  return next({ ctx: { ...ctx, user: ctx.user } });
});

const ensureUserIsAdmin = ensureLoggedIn.unstable_pipe(({ ctx, next }) => {
  if (ctx.user.type !== "admin") throw authorizationError;

  return next({ ctx: { ...ctx, user: ctx.user } });
});

/**
 * 認証が不要なプロシージャ
 */
export const publicProcedure = t.procedure;

/**
 * 認証が必要なプロシージャ
 */
export const protectedProcedure = t.procedure.use(ensureLoggedIn);

/**
 * 顧客用のプロシージャ
 */
export const customerProcedure = t.procedure.use(ensureUserIsCustomer);

/**
 * 管理者用のプロシージャ
 */
export const adminProcedure = t.procedure.use(ensureUserIsAdmin);
