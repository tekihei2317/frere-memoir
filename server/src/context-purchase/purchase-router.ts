import { router } from "../trpc/initialize";
import { createPurchase } from "./create-purchase";
import { getPurchases } from "./get-purchases-procedure";

export const purchaseRouter = router({
  purchases: getPurchases,
  createPurchase,
});
