import { z } from "zod";
import { Box, Button, Container, Stack, TextInput, NumberInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { CreateFlowerInput } from "@frere/api-schema";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { AdminMiddleware } from "@/utils/middleware";

type CreateFlowerInput = z.infer<typeof CreateFlowerInput>;

export default function CreateFlower() {
  const form = useForm<CreateFlowerInput>({
    validate: zodResolver(CreateFlowerInput),
  });
  const router = useRouter();
  const createFlower = trpc.createFlower.useMutation({
    onSuccess: () => router.push("/flowers"),
  });

  return (
    <AdminLayout>
      <Container size="lg">
        <form onSubmit={form.onSubmit((values) => createFlower.mutate(values))}>
          <Stack>
            <TextInput label="花名" {...form.getInputProps("name")} />
            <TextInput label="花コード" {...form.getInputProps("flowerCode")} />
            <NumberInput label="発注リードタイム" {...form.getInputProps("deliveryDays")} />
            <NumberInput label="購入単位数" {...form.getInputProps("purchaseQuantity")} />
            <NumberInput label="品質維持可能日数" {...form.getInputProps("maintanableDays")} />
            <Box>
              <Button type="submit" loading={createFlower.isLoading}>
                登録
              </Button>
            </Box>
          </Stack>
        </form>
      </Container>
    </AdminLayout>
  );
}

CreateFlower.Middleware = AdminMiddleware;
