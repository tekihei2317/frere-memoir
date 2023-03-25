import { AdminLayout } from "@/components/AdminLayout";
import { useZodForm } from "@/components/Form";
import { toISODateString } from "@/utils/format";
import { trpc } from "@/utils/trpc";
import { Box, Button, Container, Input, Modal, NumberInput, Table, Tabs, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { GetServerSideProps } from "next";
import { useReducer, useState } from "react";
import { DisposeFlowerInput } from "@frere/api-schema";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      flowerId: Number(context.query.flowerId),
    },
  };
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
              <td>{toISODateString(inventory.arrivalDate)}</td>
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

const InventoryDetail = ({ flowerId }: { flowerId: number }) => {
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
            <Tabs.Panel value="transition">在庫推移</Tabs.Panel>
            <Tabs.Panel value="lot">
              <FlowerInventory flowerId={flowerId} />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Container>
    </AdminLayout>
  );
};

export default InventoryDetail;
