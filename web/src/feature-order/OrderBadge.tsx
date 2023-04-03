import { Badge } from "@mantine/core";
import { OrderStatus, getOrderStatusLabel } from "./order-logic";

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const badgeColor = status === "placed" ? "orange" : "blue";

  return (
    <Badge color={badgeColor} size="lg">
      {getOrderStatusLabel(status)}
    </Badge>
  );
};
