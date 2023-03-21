import { maintenanceRouter } from "../context-maintenance/maintenance-router";
import { mergeRouters } from "./initialize";

export const appRouter = mergeRouters(maintenanceRouter);

export type AppRouter = typeof appRouter;
