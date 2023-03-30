import { AdminLayout } from "@/components/AdminLayout";
import { useZodForm } from "@/components/Form";
import { AdminMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { CreateBouquetInput } from "@frere/api-schema";
import { Box, Button, Container, TextInput, Table, Flex, NativeSelect } from "@mantine/core";
import { useRouter } from "next/router";
import { useFieldArray } from "react-hook-form";

export default function CreateBouquet() {
  const {
    Form,
    register,
    formState: { errors },
    control,
  } = useZodForm(CreateBouquetInput);
  const router = useRouter();
  const createBouquet = trpc.createBouquet.useMutation({
    onSuccess: () => router.push("/bouquets"),
  });
  const { data: flowers } = trpc.flowers.useQuery();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bouquetDetails",
  });

  return (
    <AdminLayout>
      <Container size="lg">
        <Form onSubmit={(values) => createBouquet.mutate(values)}>
          <TextInput label="花束名" error={errors.name?.message} {...register("name")} />
          <TextInput label="花束コード" error={errors.bouquetCode?.message} {...register("bouquetCode")} />
          <Box>
            <Flex justify="flex-end">
              <Button onClick={() => append({ flowerId: 1, flowerQuantity: 1 })}>花を追加する</Button>
            </Flex>
            <Table>
              <thead>
                <tr>
                  <th>花</th>
                  <th>数量</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td>
                      {flowers && (
                        <NativeSelect
                          data={flowers.map((flower) => ({ label: flower.name, value: flower.id.toString() }))}
                          {...register(`bouquetDetails.${index}.flowerId`, { valueAsNumber: true })}
                        />
                      )}
                    </td>
                    <td>
                      <TextInput
                        error={errors?.bouquetDetails?.[index]?.flowerQuantity?.message}
                        {...register(`bouquetDetails.${index}.flowerQuantity`, { valueAsNumber: true })}
                      />
                    </td>
                    <td>
                      <Button variant="default" onClick={() => remove(index)}>
                        ×
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
          <Box mt="md">
            <Button type="submit" loading={createBouquet.isLoading}>
              登録する
            </Button>
          </Box>
        </Form>
      </Container>
    </AdminLayout>
  );
}

CreateBouquet.Middleware = AdminMiddleware;
