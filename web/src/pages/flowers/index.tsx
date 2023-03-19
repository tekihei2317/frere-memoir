import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/utils/trpc";
import { Table } from "@mantine/core";

const Flowers = () => {
  const flowers = trpc.flowers.useQuery();

  return (
    <AdminLayout>
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
                <td>{flower.name}</td>
                <td>{flower.flowerCode}</td>
                <td>{flower.maintanableDays}</td>
                <td>{flower.purchaseQuantity}</td>
                <td>{flower.deliveryDays}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </AdminLayout>
  );
};

export default Flowers;
