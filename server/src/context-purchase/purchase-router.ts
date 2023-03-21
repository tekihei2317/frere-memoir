import { router } from "../trpc/initialize";
import { getPurchases } from "./get-purchases-procedure";

export const purchaseRouter = router({
  purchases: getPurchases,
});
