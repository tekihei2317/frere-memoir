import { inventoryRouter } from "../context-inventory/inventory-router";
import { maintenanceRouter } from "../context-maintenance/maintenance-router";
import { purchaseRouter } from "../context-purchase/purchase-router";
import { mergeRouters } from "./initialize";

export const appRouter = mergeRouters(maintenanceRouter, inventoryRouter, purchaseRouter);

export type AppRouter = typeof appRouter;
