import { useForm, zodResolver } from "@mantine/form";
import { CreatePurchaseInput } from "@frere/api-schema";
import { DateInput } from "@mantine/dates";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/utils/trpc";
import { z } from "zod";
import { useRouter } from "next/router";
import { toISODateString } from "@/utils/format";
import { Box, Button, Container, Group, NumberInput, Select, Stack, Table, Text } from "@mantine/core";
import { AdminMiddleware } from "@/utils/middleware";

const PurchaseDetail = z.object({
  flowerId: z.string(),
  multiplier: z.number(),
});

const CreatePurchaseForm = z.object({
  deliveryDate: z.date(),
  details: z.array(PurchaseDetail).min(1),
});

type CreatePurchaseForm = z.infer<typeof CreatePurchaseForm>;

export default function CreatePurchase() {
  const { data: flowers } = trpc.flowers.useQuery();
  const flowerMap = new Map(flowers ? flowers.map((flower) => [flower.id, flower]) : []);
  const form = useForm<CreatePurchaseForm, (values: CreatePurchaseForm) => CreatePurchaseInput>({
    validate: zodResolver(CreatePurchaseForm),
    initialValues: {
      deliveryDate: new Date(),
      details: [],
    },
    transformValues: (values) => ({
      deliveryDate: toISODateString(values.deliveryDate),
      details: values.details.map((detail) => ({
        flowerId: Number(detail.flowerId),
        orderQuantity: detail.multiplier * (flowerMap.get(Number(detail.flowerId))?.purchaseQuantity ?? 0),
      })),
    }),
  });

  const router = useRouter();
  const createPurchase = trpc.createPurchase.useMutation({ onSuccess: () => router.push("/purchases") });

  return (
    <AdminLayout>
      <Container size="lg">
        <form onSubmit={form.onSubmit((values) => createPurchase.mutate(values))}>
          <Stack>
            <DateInput label="希望納品日" {...form.getInputProps("deliveryDate")} />

            <Box>
              <Text size="sm">発注明細</Text>
              <Group position="right">
                <Button onClick={() => form.insertListItem("details", { flowerId: "1", multiplier: 1 })}>追加</Button>
              </Group>
              <Table mt="xs">
                <thead>
                  <tr>
                    <th>花（購入単位数）</th>
                    <th></th>
                    <th>数量</th>
                    <th>合計</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {form.values.details.map((detail, index) => (
                    <tr key={index}>
                      <td>
                        {flowers && (
                          <Select
                            data={flowers.map((flower) => ({
                              value: flower.id.toString(),
                              label: `${flower.name}（${flower.purchaseQuantity}）`,
                            }))}
                            searchable
                            {...form.getInputProps(`details.${index}.flowerId`)}
                          />
                        )}
                      </td>
                      <td>×</td>
                      <td>
                        <NumberInput {...form.getInputProps(`details.${index}.multiplier`)} />
                      </td>
                      <td>
                        {detail.multiplier *
                          (flowerMap.get(Number(form.values.details[index].flowerId))?.purchaseQuantity ?? 0)}
                      </td>
                      <td>
                        <Button variant="default" onClick={() => form.removeListItem("details", index)}>
                          ×
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>

            <Box>
              <Button type="submit" loading={createPurchase.isLoading}>
                仕入れする
              </Button>
            </Box>
          </Stack>
        </form>
      </Container>
    </AdminLayout>
  );
}

CreatePurchase.Middleware = AdminMiddleware;
