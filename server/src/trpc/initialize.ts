import { initTRPC, TRPCError } from "@trpc/server";
import { prisma } from "../database/prisma";

export function createContext() {
  return { prisma };
}

type Context = ReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
export const router = t.router;
export const mergeRouters = t.mergeRouters;

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
 * 顧客用のプロシージャ
 */
export const customerProcedure = t.procedure.use(ensureUserIsCustomer);

/**
 * 管理者用のプロシージャ
 */
export const adminProcedure = t.procedure.use(ensureUserIsAdmin);
