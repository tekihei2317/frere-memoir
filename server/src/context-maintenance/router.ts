import { router } from "../trpc/initialize";
import { getBouquet, getBouquets } from "./bouquet-procedure";
import { createFlower, getFlower, getFlowers, updateFlower } from "./flower-procedure";

export const maintenanceRouter = router({
  flowers: getFlowers,
  flower: getFlower,
  createFlower,
  updateFlower,
  bouquets: getBouquets,
  bouquet: getBouquet,
});
