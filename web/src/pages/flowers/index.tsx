import { AdminLayout } from "@/components/AdminLayout";
import { AdminMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { Button, Container, Group, Table } from "@mantine/core";
import Link from "next/link";

export default function Flowers() {
  const flowers = trpc.flowers.useQuery();

  return (
    <AdminLayout>
      <Container size="lg">
        <Group position="right">
          <Button component={Link} href="/flowers/create">
            登録する
          </Button>
        </Group>
        <Table>
          <thead>
            <tr>
              <th>花名</th>
              <th>花コード</th>
              <th>品質維持可能日数</th>
              <th>購入単位数</th>
              <th>発注リードタイム</th>
            </tr>
          </thead>
          <tbody>
            {flowers.data &&
              flowers.data.map((flower) => (
                <tr key={flower.id}>
                  <td>
                    <Link href={`/flowers/${flower.id}`}>{flower.name}</Link>
                  </td>
                  <td>{flower.flowerCode}</td>
                  <td>{flower.maintanableDays}</td>
                  <td>{flower.purchaseQuantity}</td>
                  <td>{flower.deliveryDays}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
}

Flowers.Middleware = AdminMiddleware;
