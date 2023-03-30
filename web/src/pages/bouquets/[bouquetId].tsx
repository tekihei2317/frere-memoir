import { AdminLayout } from "@/components/AdminLayout";
import { AdminMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { Anchor, Container, Table, Text } from "@mantine/core";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{ bouquetId: number }> = async (ctx) => {
  return {
    props: {
      bouquetId: Number(ctx.query.bouquetId),
    },
  };
};

export default function BouquetDetail({ bouquetId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: bouquet } = trpc.bouquet.useQuery({ bouquetId });

  return (
    <AdminLayout>
      <Container size="lg">
        <Text size="lg">{bouquet?.name}</Text>
        <Table mt="md">
          <thead>
            <tr>
              <th>名前</th>
              <th>花コード</th>
              <th>本数</th>
            </tr>
          </thead>
          <tbody>
            {bouquet?.bouquetDetails.map((detail) => (
              <tr key={detail.id}>
                <td>
                  <Anchor component={Link} href={`/flowers/${detail.flower.id}`}>
                    {detail.flower.name}
                  </Anchor>
                </td>
                <td>{detail.flower.flowerCode}</td>
                <td>{detail.flowerQuantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
}

BouquetDetail.Middleware = AdminMiddleware;
