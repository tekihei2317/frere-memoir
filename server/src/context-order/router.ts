import { router } from "../trpc/initialize";
import { cancelOrder } from "./cancel-order";
import { getOrderHistories } from "./get-order-history";
import { placeOrder } from "./place-order";

export const orderRouter = router({
  placeOrder,
  cancelOrder,
  orderHistories: getOrderHistories,
});
