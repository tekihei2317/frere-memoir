import { useCallback, useEffect, useState } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/utils/trpc";
import { Box, Button, Container, Group, Stack, Table, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { toISODateString } from "@/utils/format";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import { ArrivalInfoModal } from "@/feature-purchase/ArrivalInfoModal";
import { AdminMiddleware } from "@/utils/middleware";

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      purchaseId: Number(context.query.purchaseId),
    },
  };
}

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
  const { data: purchase } = trpc.purchase.useQuery({ purchaseId });
  const { deliveryDateForm, setDeliveryDate } = useDeliveryDateForm();
  const [isModalOpened, modalMethods] = useDisclosure(false);

  const changeDeliveryDate = trpc.changeDeliveryDate.useMutation({
    onSuccess: () => notifications.show({ message: "希望納品日を変更しました" }),
  });

  const router = useRouter();
  const cancelPurchase = trpc.cancelPurchase.useMutation({
    onSuccess: () => {
      notifications.show({ message: "発注をキャンセルしました" });
      router.push("/purchases");
    },
  });

  const registerArrivalInfo = trpc.registerArrivalInfo.useMutation({
    onSuccess: () => modalMethods.close(),
  });

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
                    {purchase?.status === "arrived" && <th>入荷数</th>}
                  </tr>
                </thead>
                <tbody>
                  {purchase &&
                    purchase.orderDetails.map((detail, index) => (
                      <tr key={index}>
                        <td>
                          {detail.flower.name}（{detail.flower.purchaseQuantity}）
                        </td>
                        <td>{detail.orderQuantity}</td>
                        <td>{detail.arrival?.arrivedQuantity}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Box>
          </Stack>
        </form>
        <Group mt="md">
          {purchase?.status === "placed" && (
            <>
              <Button onClick={modalMethods.open}>入荷情報を登録する</Button>
              <Button onClick={() => confirm("本当にキャンセルしますか？") && cancelPurchase.mutate({ purchaseId })}>
                発注をキャンセルする
              </Button>
              {deliveryDateForm && (
                <Button
                  disabled={!deliveryDateForm.isDirty}
                  loading={changeDeliveryDate.isLoading}
                  onClick={() =>
                    changeDeliveryDate.mutate({ purchaseId, deliveryDate: toISODateString(deliveryDateForm.value) })
                  }
                >
                  納品日を変更する
                </Button>
              )}
            </>
          )}
        </Group>
        <Box>
          {purchase && (
            <ArrivalInfoModal
              opened={isModalOpened}
              onClose={modalMethods.close}
              purchase={purchase}
              onSubmit={(values) => registerArrivalInfo.mutate(values)}
              isSubmitting={registerArrivalInfo.isLoading}
            />
          )}
        </Box>
      </Container>
    </AdminLayout>
  );
}

PurchaseDetail.Middleware = AdminMiddleware;
