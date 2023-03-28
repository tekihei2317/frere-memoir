import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { authRouter } from "../context-auth/router";
import { inventoryRouter } from "../context-inventory/router";
import { maintenanceRouter } from "../context-maintenance/router";
import { purchaseRouter } from "../context-purchase/router";
import { mergeRouters } from "./initialize";

export const appRouter = mergeRouters(authRouter, maintenanceRouter, inventoryRouter, purchaseRouter);

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
