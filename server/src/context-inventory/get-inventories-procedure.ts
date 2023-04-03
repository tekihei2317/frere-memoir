import { adminProcedure } from "../trpc/initialize";
import { getInventorySummaries as inventorySummariesQuery } from "./get-inventory-summaries";

export const getInventorySummaries = adminProcedure.query(async () => {
  const result = await inventorySummariesQuery();
  return result;
});
