import { router } from "../trpc/initialize";
import { getInventorySummaries } from "./get-inventories-procedure";

export const inventoryRouter = router({
  inventorySummaries: getInventorySummaries,
});
