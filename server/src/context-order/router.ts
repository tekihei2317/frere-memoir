import { router } from "../trpc/initialize";
import { getOrderHistories } from "./get-order-history";
import { placeOrder } from "./place-order";

export const orderRouter = router({
  placeOrder,
  orderHistories: getOrderHistories,
});
