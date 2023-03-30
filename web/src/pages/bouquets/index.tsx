import { AdminLayout } from "@/components/AdminLayout";
import { InferMiddlewareProps } from "@/lib/react-middleware";
import { AdminMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { Anchor, Button, Container, Group, Table } from "@mantine/core";
import Link from "next/link";

export default function Bouquets({}: InferMiddlewareProps<typeof AdminMiddleware>) {
  const { data: bouquets } = trpc.bouquets.useQuery();

  return (
    <AdminLayout>
      <Container size="lg">
        <Group position="right">
          <Button component={Link} href="/bouquets/create">
            登録する
          </Button>
        </Group>
        <Table>
          <thead>
            <tr>
              <th>名前</th>
              <th>花束コード</th>
            </tr>
          </thead>
          <tbody>
            {bouquets &&
              bouquets.map((bouquet) => (
                <tr key={bouquet.id}>
                  <td>
                    <Anchor component={Link} href={`/bouquets/${bouquet.id}`}>
                      {bouquet.name}
                    </Anchor>
                  </td>
                  <td>{bouquet.bouquetCode}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
}

Bouquets.Middleware = AdminMiddleware;
