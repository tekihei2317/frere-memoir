import { CustomerLayout } from "@/components/CustomerLayout";
import { formatDate } from "@/utils/format";
import { CusotmerMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { Box, Button, Container, Group, Table, Title } from "@mantine/core";
import Link from "next/link";

export default function MyPage() {
  const { data: orders } = trpc.orderHistories.useQuery();
  const cancelOrder = trpc.cancelOrder.useMutation();

  const handleCancelOrder = (orderId: number) => {
    if (confirm("本当にキャンセルしますか？")) {
      cancelOrder.mutate({ orderId });
    }
  };

  return (
    <CustomerLayout>
      <Container size="md">
        <Group position="right">
          <Button component={Link} href="/place-order">
            注文する
          </Button>
        </Group>
        <Box>
          <Title order={2} size="h3">
            注文履歴
          </Title>
          <Table mt="md">
            <thead>
              <tr>
                <th>注文日</th>
                <th>花束</th>
                <th>金額</th>
                <th>状態</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.bouquet.name}</td>
                  <td>¥{order.totalAmount.toLocaleString()}</td>
                  <td>{order.status === "placed" ? "注文済み" : "出荷済み"}</td>
                  <td>
                    {order.status === "placed" && (
                      <Button size="xs" variant="default" onClick={() => handleCancelOrder(order.id)}>
                        購入キャンセル
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </Container>
    </CustomerLayout>
  );
}

MyPage.Middleware = CusotmerMiddleware;
