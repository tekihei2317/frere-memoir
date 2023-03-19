import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@frere/trpc";

export default createNextApiHandler({
  router: appRouter,
});
