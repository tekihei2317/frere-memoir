import { useCallback, useEffect, useReducer, useState } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/utils/trpc";
import { Box, Button, Container, Group, Stack, Table, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";

type DeliveryDateForm = { isDirty: boolean; value: Date };

// useReducerを使いたかった
function useDeliveryDateForm() {
  const [deliveryDateForm, setDeliveryDateInner] = useState<DeliveryDateForm | undefined>(undefined);
  const setDeliveryDate = useCallback((value: Date, isFirst?: boolean) => {
    if (isFirst) setDeliveryDateInner({ isDirty: false, value });
    else setDeliveryDateInner({ isDirty: true, value });
  }, []);

  return { deliveryDateForm, setDeliveryDate };
}

export default function PurchaseDetail({ purchaseId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: purchase } = trpc.purchase.useQuery({ id: purchaseId });
  const { deliveryDateForm, setDeliveryDate } = useDeliveryDateForm();

  useEffect(() => {
    if (!purchase) return;
    setDeliveryDate(purchase.deliveryDate, true);
  }, [purchase, setDeliveryDate]);

  return (
    <AdminLayout>
      <Container size="lg">
        <form>
          <Stack>
            <DateInput label="希望納品日" value={deliveryDateForm?.value} onChange={setDeliveryDate} />
            <Box>
              <Text size="sm">発注明細</Text>
              <Table mt="xs">
                <thead>
                  <tr>
                    <th>花（購入単位数）</th>
                    <th>数量</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {purchase &&
                    purchase.orderDetails.map((detail, index) => (
                      <tr key={index}>
                        <td>
                          {detail.flower.name}（{detail.flower.purchaseQuantity}）
                        </td>
                        <td> {detail.orderQuantity} </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Box>
          </Stack>
        </form>
        <Group mt="md">
          <Button>入荷情報を登録する</Button>
          <Button>発注をキャンセルする</Button>
          <Button disabled={!deliveryDateForm?.isDirty}>納品日を変更する</Button>
        </Group>
      </Container>
    </AdminLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      purchaseId: Number(context.query.purchaseId),
    },
  };
}
