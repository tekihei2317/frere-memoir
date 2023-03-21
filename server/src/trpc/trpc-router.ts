import { inventoryRouter } from "../context-inventory/inventory-router";
import { maintenanceRouter } from "../context-maintenance/maintenance-router";
import { mergeRouters } from "./initialize";

export const appRouter = mergeRouters(maintenanceRouter, inventoryRouter);

export type AppRouter = typeof appRouter;
