import { AdminLayout } from "@/components/AdminLayout";
import { getOrderStatusLabel } from "@/feature-order/order-logic";
import { formatDate } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { Box, Button, Container, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{ orderId: number }> = async (context) => {
  return {
    props: {
      orderId: Number(context.query.orderId),
    },
  };
};

export default function OrderDetail({ orderId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: order } = trpc.order.useQuery({ orderId });

  const utils = trpc.useContext();
  const shipOrder = trpc.shipOrder.useMutation({
    onSuccess: () => {
      notifications.show({ message: "注文を出荷済みに変更しました" });
      utils.order.invalidate({ orderId });
    },
  });

  const handleShipOrder = () => {
    if (confirm("注文を出荷済みに変更します。よろしいですか？")) {
      shipOrder.mutate({ orderId });
    }
  };

  return (
    <AdminLayout>
      <Container size="lg">
        {order && (
          <Table>
            <tbody>
              <tr>
                <th>花束</th>
                <td>{order.bouquet.name}</td>
              </tr>
              <tr>
                <th>顧客名</th>
                <td>{order.customer.name}</td>
              </tr>
              <tr>
                <th>お届け日</th>
                <td>{formatDate(order.deliveryDate)}</td>
              </tr>
              <tr>
                <th>状態</th>
                <td>{getOrderStatusLabel(order.status)}</td>
              </tr>
              <tr>
                <th>送り主名</th>
                <td>{order.senderName}</td>
              </tr>
              <tr>
                <th>お届け先住所</th>
                <td>
                  {order.deliveryAddress1}
                  {order.deliveryAddress2}
                </td>
              </tr>
              <tr>
                <th>お届けメッセージ</th>
                <td>{order.deliveryMessage}</td>
              </tr>
            </tbody>
          </Table>
        )}
        {order?.status === "placed" && (
          <Box mt="sm">
            <Button onClick={handleShipOrder}>出荷する</Button>
          </Box>
        )}
      </Container>
    </AdminLayout>
  );
}
