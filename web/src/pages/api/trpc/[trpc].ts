import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter, createContext } from "@frere/trpc";

export default createNextApiHandler({
  router: appRouter,
  createContext,
});
