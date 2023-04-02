import { router } from "../trpc/initialize";
import { cancelOrder } from "./cancel-order";
import { getOrderHistories } from "./get-order-history";
import { placeOrder } from "./place-order";
import { changeOrderDeliveryDate } from "./change-delivery-date";
import { getOrders } from "./get-orders";

export const orderRouter = router({
  placeOrder,
  cancelOrder,
  orderHistories: getOrderHistories,
  changeOrderDeliveryDate,
  orders: getOrders,
});
