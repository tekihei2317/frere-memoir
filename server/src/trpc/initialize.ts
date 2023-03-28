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

  return { prisma, session };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
export const router = t.router;
export const mergeRouters = t.mergeRouters;

export const notFoundError = new TRPCError({ code: "NOT_FOUND", message: "データが見つかりませんでした" });

const ensureLoggedIn = t.middleware(({ ctx, next }) => {
  return next({ ctx });
});

const ensureUserIsCustomer = t.middleware(({ ctx, next }) => {
  return next({ ctx });
});

const ensureUserIsAdmin = t.middleware(({ ctx, next }) => {
  return next({ ctx });
});

/**
 * 認証が不要なプロシージャ
 */
export const publicProcedure = t.procedure;

/**
 * 認証が必要なプロシージャ
 */
export const protectedProcedure = t.procedure;

/**
 * 顧客用のプロシージャ
 */
export const customerProcedure = t.procedure.use(ensureUserIsCustomer);

/**
 * 管理者用のプロシージャ
 */
export const adminProcedure = t.procedure.use(ensureUserIsAdmin);
