import { router } from "../trpc/initialize";
import { createPurchase } from "./create-purchase";
import { getPurchase } from "./get-purchase";
import { getPurchases } from "./get-purchases-procedure";

export const purchaseRouter = router({
  purchases: getPurchases,
  purchase: getPurchase,
  createPurchase,
});
