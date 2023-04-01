import { router } from "../trpc/initialize";
import { placeOrder } from "./place-order";

export const orderRouter = router({
  placeOrder,
});
