import { AdminLayout } from "@/components/AdminLayout";
import { useZodForm } from "@/components/Form";
import { formatDate } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { Box, Button, Container, Input, Modal, NumberInput, Table, Tabs, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { DisposeFlowerInput } from "@frere/api-schema";
import { AdminMiddleware } from "@/utils/middleware";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      flowerId: Number(context.query.flowerId),
    },
  };
};

const InventoryTransition = ({ flowerId }: { flowerId: number }) => {
  const { data: transitions } = trpc.inventoryTransition.useQuery({ flowerId });
  const { data: flower } = trpc.flower.useQuery({ id: flowerId });

  const inventoryHeader =
    flower &&
    [...new Array(flower.maintanableDays + 1)].map((_, index) => (
      <th key={index}>{index === 0 ? "当日" : index < flower.maintanableDays ? `${index}日前` : "廃棄"}</th>
    ));

  return (
    <Table>
      <thead>
        <tr>
          <th>日付</th>
          <th>入荷予定数</th>
          <th>加工予定数</th>
          {inventoryHeader}
        </tr>
      </thead>
      <tbody>
        {transitions?.map((transition, index) => (
          <tr key={index}>
            <td>{formatDate(transition.date)}</td>
            <td>{transition.arrivalQuantity}</td>
            <td>{transition.shipmentQuantity}</td>
            {transition.inventories.map((quantity, index) => (
              <td key={index}>{quantity}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

type FlowerInventoryProps = {
  flowerId: number;
};

const FlowerInventory = ({ flowerId }: FlowerInventoryProps) => {
  const { data: flowerInventories } = trpc.flowerInventories.useQuery({ flowerId });
  const [opened, modalMethods] = useDisclosure();
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | undefined>();
  const DisposeFlowerForm = DisposeFlowerInput.pick({ disposedCount: true });
  const {
    Form,
    register,
    formState: { errors },
  } = useZodForm(DisposeFlowerForm);

  const startDispose = (inventoryId: number) => {
    setSelectedInventoryId(inventoryId);
    modalMethods.open();
  };

  const utils = trpc.useContext();
  const disposeFlower = trpc.disposeFlower.useMutation({
    onSuccess: () => {
      modalMethods.close();
      utils.flowerInventories.invalidate({ flowerId });
    },
  });

  return (
    <Box>
      <Table>
        <thead>
          <tr>
            <th>日付</th>
            <th>在庫数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {flowerInventories?.map((inventory, index) => (
            <tr key={index}>
              <td>{formatDate(inventory.arrivalDate)}</td>
              <td>{inventory.currentQuantity}</td>
              <td>
                <Button size="xs" onClick={() => startDispose(inventory.id)}>
                  破棄
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal title="花を破棄する" opened={opened} onClose={modalMethods.close}>
        <Form
          onSubmit={(values) => disposeFlower.mutate({ ...values, flowerInventoryId: selectedInventoryId as number })}
        >
          <TextInput
            label="破棄数"
            error={errors.disposedCount?.message}
            {...register("disposedCount", { valueAsNumber: true })}
          />
          <Box>
            <Button type="submit" loading={disposeFlower.isLoading}>
              破棄する
            </Button>
          </Box>
        </Form>
      </Modal>
    </Box>
  );
};

export default function InventoryDetail({ flowerId }: { flowerId: number }) {
  const { data: flower } = trpc.flower.useQuery({ id: flowerId });

  return (
    <AdminLayout>
      <Container size="lg">
        {flower && <Text>{flower.name}の在庫</Text>}
        <Tabs defaultValue="transition" variant="pills" mt="md">
          <Tabs.List>
            <Tabs.Tab value="transition">在庫推移</Tabs.Tab>
            <Tabs.Tab value="lot">日付別在庫</Tabs.Tab>
          </Tabs.List>
          <Box pt="md">
            <Tabs.Panel value="transition">
              <InventoryTransition flowerId={flowerId} />
            </Tabs.Panel>
            <Tabs.Panel value="lot">
              <FlowerInventory flowerId={flowerId} />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Container>
    </AdminLayout>
  );
}

InventoryDetail.Middleware = AdminMiddleware;
