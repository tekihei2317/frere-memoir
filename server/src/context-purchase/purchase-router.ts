import { router } from "../trpc/initialize";
import { cancelPurchase } from "./cancel-purchase";
import { changeDeliveryDate } from "./change-delivery-date";
import { createPurchase } from "./create-purchase";
import { getPurchase } from "./get-purchase";
import { getPurchases } from "./get-purchases-procedure";
import { registerArrivalInformation } from "./register-arrival-information";

export const purchaseRouter = router({
  purchases: getPurchases,
  purchase: getPurchase,
  createPurchase,
  changeDeliveryDate,
  cancelPurchase,
  registerArrivalInfo: registerArrivalInformation,
});
