import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/utils/trpc";
import { Anchor, Container, Table } from "@mantine/core";
import Link from "next/link";

const Inventories = () => {
  const { data: inventorySummaries } = trpc.inventorySummaries.useQuery();

  return (
    <AdminLayout>
      <Container size="lg" mt="md">
        <Table>
          <thead>
            <tr>
              <th>花名</th>
              <th>在庫数</th>
              <th>入荷予定</th>
              <th>出荷予定</th>
              <th>在庫詳細</th>
            </tr>
          </thead>
          <tbody>
            {inventorySummaries &&
              inventorySummaries.map((summary) => (
                <tr key={summary.flowerId}>
                  <td>{summary.flowerName}</td>
                  <td>{summary.stockCount}</td>
                  <td>{summary.expectedArrivalCount}</td>
                  <td>{summary.expectedShipmentCount}</td>
                  <td>
                    <Anchor component={Link} href={`/inventories/${summary.flowerId}`}>
                      詳細
                    </Anchor>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
};

export default Inventories;
