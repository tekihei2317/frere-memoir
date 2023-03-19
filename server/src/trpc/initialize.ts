import { initTRPC } from "@trpc/server";

const t = initTRPC.create();
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
