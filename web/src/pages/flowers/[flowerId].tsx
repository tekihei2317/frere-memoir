import { z } from "zod";
import { Box, Button, Container, Stack, TextInput, NumberInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { UpdateFlowerInput } from "@frere/api-schema";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useEffect } from "react";

const UpdateFlowerForm = UpdateFlowerInput.omit({ id: true });
type UpdateFlowerForm = z.infer<typeof UpdateFlowerForm>;

type DefaultUpdateFlowerForm = {
  name: string;
  flowerCode: string;
  deliveryDays: number | null;
  purchaseQuantity: number | null;
  maintanableDays: number | null;
};

const FlowerDetail = ({ flowerId }: { flowerId: number }) => {
  const router = useRouter();
  const flowerQuery = trpc.flower.useQuery({ id: Number(flowerId) });
  const { setValues, ...form } = useForm<
    DefaultUpdateFlowerForm,
    (values: DefaultUpdateFlowerForm) => UpdateFlowerForm
  >({
    validate: zodResolver(UpdateFlowerForm),
    initialValues: {
      name: "",
      flowerCode: "",
      deliveryDays: null,
      purchaseQuantity: null,
      maintanableDays: null,
    },
  });

  const updateFlower = trpc.updateFlower.useMutation({
    onSuccess: () => router.push("/flowers"),
  });

  useEffect(() => {
    if (!flowerQuery.data) return;
    setValues(flowerQuery.data);
  }, [flowerQuery.data, setValues]);

  return (
    <AdminLayout>
      <Container size="lg">
        {flowerQuery.data && (
          <form onSubmit={form.onSubmit((values) => updateFlower.mutate({ ...values, id: Number(flowerId) }))}>
            <Stack>
              <TextInput label="花名" {...form.getInputProps("name")} />
              <TextInput label="花コード" {...form.getInputProps("flowerCode")} />
              <NumberInput label="発注リードタイム" {...form.getInputProps("deliveryDays")} />
              <NumberInput label="購入単位数" {...form.getInputProps("purchaseQuantity")} />
              <NumberInput label="品質維持可能日数" {...form.getInputProps("maintanableDays")} />
              <Box>
                <Button type="submit" loading={updateFlower.isLoading}>
                  更新
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Container>
    </AdminLayout>
  );
};

export default FlowerDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      flowerId: Number(context.query.flowerId),
    },
  };
};
