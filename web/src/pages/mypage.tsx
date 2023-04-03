import { CustomerLayout } from "@/components/CustomerLayout";
import { useZodForm } from "@/components/Form";
import { formatDate } from "@/utils/format";
import { CusotmerMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { ChangeOrderDeliveryDateInput } from "@frere/api-schema";
import { Box, Button, Container, Group, Input, Modal, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";

type DeliveryDateModalProps = {
  opened: boolean;
  onClose: () => void;
  orderId: number;
  deliveryDate: Date;
};

const DeliveryDateModal = ({ opened, orderId, deliveryDate, onClose }: DeliveryDateModalProps) => {
  const {
    Form,
    register,
    formState: { errors },
    reset,
  } = useZodForm(ChangeOrderDeliveryDateInput);

  useEffect(() => {
    reset({
      orderId,
      // FIXME: input[type=date]の初期値は文字列で設定する必要があった
      deliveryDate: formatDate(deliveryDate) as unknown as Date,
    });
  }, [reset, orderId, deliveryDate]);

  const utils = trpc.useContext();
  const changeDeliveryDate = trpc.changeOrderDeliveryDate.useMutation({
    onSuccess: () => {
      onClose();
      utils.orderHistories.invalidate();
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} title="お届け日を変更する">
      <Form onSubmit={(values) => changeDeliveryDate.mutate(values)}>
        <Input type="date" error={errors.deliveryDate?.message} {...register("deliveryDate", { valueAsDate: true })} />
        <Box>
          <Button type="submit" loading={changeDeliveryDate.isLoading}>
            変更する
          </Button>
        </Box>
      </Form>
    </Modal>
  );
};

export default function MyPage() {
  const { data: orders } = trpc.orderHistories.useQuery();
  const cancelOrder = trpc.cancelOrder.useMutation();

  const handleCancelOrder = (orderId: number) => {
    if (confirm("本当にキャンセルしますか？")) {
      cancelOrder.mutate({ orderId });
    }
  };

  const [opened, modalMethods] = useDisclosure();
  const [modalInput, setModalInput] = useState<{ orderId: number; deliveryDate: Date }>();
  const handleOpenDeliveryDateModal = (input: { orderId: number; deliveryDate: Date }) => {
    modalMethods.open();
    setModalInput(input);
  };

  return (
    <CustomerLayout>
      <Container size="md">
        <Group position="right">
          <Button component={Link} href="/place-order">
            注文する
          </Button>
        </Group>
        <Box>
          <Title order={2} size="h3">
            注文履歴
          </Title>
          <Table mt="md">
            <thead>
              <tr>
                <th>注文日</th>
                <th>花束</th>
                <th>金額</th>
                <th>状態</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.bouquet.name}</td>
                  <td>¥{order.totalAmount.toLocaleString()}</td>
                  <td>{order.status === "placed" ? "注文済み" : "出荷済み"}</td>
                  <td>
                    {order.status === "placed" && (
                      <Group>
                        <Button size="xs" variant="default" onClick={() => handleCancelOrder(order.id)}>
                          購入キャンセル
                        </Button>
                        <Button
                          size="xs"
                          variant="default"
                          onClick={() =>
                            handleOpenDeliveryDateModal({ orderId: order.id, deliveryDate: order.deliveryDate })
                          }
                        >
                          お届け日を変更する
                        </Button>
                      </Group>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
        {modalInput && <DeliveryDateModal opened={opened} onClose={modalMethods.close} {...modalInput} />}
      </Container>
    </CustomerLayout>
  );
}

MyPage.Middleware = CusotmerMiddleware;
