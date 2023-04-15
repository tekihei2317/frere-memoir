import { router } from "../trpc/initialize";
import { disposeFlower } from "./dispose-flower";
import { getFlowerInventories } from "./get-flower-lots";
import { getInventorySummaries } from "./get-inventories-procedure";
import { getInventoryTransition } from "./get-inventory-transition";

export const inventoryRouter = router({
  inventorySummaries: getInventorySummaries,
  inventoryTransition: getInventoryTransition,
  flowerInventories: getFlowerInventories,
  disposeFlower,
});
