import { Box, Button, Input, Modal, Table } from "@mantine/core";
import { RegisterArrivalInformationInput } from "@frere/api-schema";
import { useZodForm } from "@/components/Form";
import { RouterOutput } from "@frere/trpc";

type Purchase = RouterOutput["purchase"];

type ArrivalInfoModalProops = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (arrivalInfo: RegisterArrivalInformationInput) => void;
  isSubmitting: boolean;
  purchase: Purchase;
};

export const ArrivalInfoModal = ({ opened, onClose, onSubmit, purchase, isSubmitting }: ArrivalInfoModalProops) => {
  const { Form, register } = useZodForm(RegisterArrivalInformationInput, {
    defaultValues: {
      purchaseId: purchase.id,
      arrivalDetails: purchase.orderDetails.map((detail) => ({
        orderDetailId: detail.id,
        arrivedCount: detail.orderQuantity,
      })),
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} size="lg" title="入荷情報の登録">
      <Form onSubmit={onSubmit}>
        <Table>
          <thead>
            <tr>
              <th>花名</th>
              <th>入荷数</th>
            </tr>
          </thead>
          <tbody>
            {purchase.orderDetails.map((detail, index) => (
              <tr key={index}>
                <td>{detail.flower.name}</td>
                <td>
                  <Input {...register(`arrivalDetails.${index}.arrivedCount` as const, { valueAsNumber: true })} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Box>
          <Button type="submit" loading={isSubmitting}>
            登録する
          </Button>
        </Box>
      </Form>
    </Modal>
  );
};
