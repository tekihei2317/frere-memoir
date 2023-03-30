import { AdminLayout } from "@/components/AdminLayout";
import { toISODateString } from "@/utils/format";
import { AdminMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { Anchor, Button, Container, Group, Table } from "@mantine/core";
import Link from "next/link";

export default function Purchases() {
  const { data: purchases } = trpc.purchases.useQuery();

  return (
    <AdminLayout>
      <Container size="lg">
        <Group position="right">
          <Button component={Link} href="/purchases/create">
            仕入れする
          </Button>
        </Group>
        <Table mt="sm">
          <thead>
            <tr>
              {/* <th>発注番号</th> */}
              <th>仕入れID</th>
              <th>発注先</th>
              <th>納品日</th>
              <th>ステータス</th>
            </tr>
          </thead>
          <tbody>
            {purchases &&
              purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>
                    <Anchor component={Link} href={`/purchases/${purchase.id}`}>
                      {purchase.id}
                    </Anchor>
                  </td>
                  <td>園芸センター</td>
                  <td>{toISODateString(purchase.deliveryDate)}</td>
                  <td>{purchase.status === "placed" ? "発注中" : "入荷完了"}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
}

Purchases.Middleware = AdminMiddleware;
