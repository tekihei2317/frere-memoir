import { router } from "../trpc/initialize";
import { disposeFlower } from "./dispose-flower";
import { getFlowerInventories } from "./get-flower-lots";
import { getInventorySummaries } from "./get-inventories-procedure";

export const inventoryRouter = router({
  inventorySummaries: getInventorySummaries,
  flowerInventories: getFlowerInventories,
  disposeFlower,
});
