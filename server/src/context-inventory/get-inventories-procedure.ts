import { adminProcedure } from "../trpc/initialize";
import { getInventorySummaries as inventorySummariesQuery } from "./get-inventory-summaries";

export const getInventorySummaries = adminProcedure.query(async ({ ctx }) => {
  const result = await inventorySummariesQuery(ctx.prisma);
  return result;
});
