import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/utils/trpc";
import { Button, Container, Group, Table } from "@mantine/core";
import Link from "next/link";

const Purchases = () => {
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
              <th>発注番号</th>
              <th>発注先</th>
              <th>納品日</th>
              <th>ステータス</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {purchases &&
              purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.purchaseNumber}</td>
                  <td>園芸センター</td>
                  <td>{purchase.deliveryDate}</td>
                  <td>{purchase.status}</td>
                  <td></td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
};

export default Purchases;
