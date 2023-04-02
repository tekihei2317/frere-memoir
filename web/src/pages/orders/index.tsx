import { AdminLayout } from "@/components/AdminLayout";
import { useZodForm } from "@/components/Form";
import { OrderStatus, getOrderStatusLabel } from "@/feature-order/order-logic";
import { formatDate } from "@/utils/format";
import { AdminMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { GetOrdersInput } from "@frere/api-schema";
import { Anchor, Button, Container, Select, Table, Box } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

type SearchOrdersForm = {
  status?: OrderStatus | undefined;
};

export default function BouquetOrders() {
  const { Form, setValue } = useZodForm(GetOrdersInput);
  const [formValues, setFormValues] = useState<SearchOrdersForm>({});
  const { data: orders, isLoading } = trpc.orders.useQuery({ status: formValues.status });

  return (
    <AdminLayout>
      <Container size="lg">
        <Form onSubmit={(values) => setFormValues(values)}>
          <Select
            label="状態"
            data={[
              { label: "注文済み", value: "placed" },
              { label: "出荷済み", value: "shipped" },
            ]}
            onChange={(value) => setValue("status", value === null ? undefined : (value as OrderStatus))}
            clearable
            style={{ maxWidth: 320 }}
          />
          <Box>
            <Button type="submit" loading={isLoading}>
              検索
            </Button>
          </Box>
        </Form>
        <Table mt="md">
          <thead>
            <tr>
              <th>注文ID</th>
              <th>花束</th>
              <th>顧客名</th>
              <th>お届け日</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {orders?.items?.map((order) => (
              <tr key={order.id}>
                <td>
                  <Anchor component={Link} href={`/orders/${order.id}`}>
                    {order.id}
                  </Anchor>
                </td>
                <td>
                  <Anchor component={Link} href={`/bouquets/${order.bouquet.id}`}>
                    {order.bouquet.name}
                  </Anchor>
                </td>
                <td>{order.customer.name}</td>
                <td>{formatDate(order.deliveryDate)}</td>
                <td>{getOrderStatusLabel(order.status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
}

BouquetOrders.Middleware = AdminMiddleware;
