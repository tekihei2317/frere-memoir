import { router } from "../trpc/initialize";
import { createFlower, getFlower, getFlowers, updateFlower } from "./flower-procedure";

export const maintenanceRouter = router({
  flowers: getFlowers,
  flower: getFlower,
  createFlower,
  updateFlower,
});
