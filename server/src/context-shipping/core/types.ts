import { ShippedOrder } from "../../context-order/core/types";
import { DefineWorkflow } from "../../utils/workflow";

/**
 * 花束を加工して出荷する
 */
export type ShipOrderWorkflow = DefineWorkflow<{
  input: { orderId: number };
  output: Promise<ShippedOrder>;
  steps: {};
}>;
