import { CustomerLayout } from "@/components/CustomerLayout";
import { CusotmerMiddleware } from "@/utils/middleware";
import { Box, Button, Container, Select, TextInput } from "@mantine/core";
import { ChangeDeliveryDateInput, PlaceOrderForm } from "@frere/api-schema";
import { useZodForm } from "@/components/Form";
import { trpc } from "@/utils/trpc";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/router";

export default function PlaceOrder() {
  const {
    Form,
    register,
    formState: { errors },
    setValue,
  } = useZodForm(PlaceOrderForm);
  const router = useRouter();
  const placeOrder = trpc.placeOrder.useMutation({ onSuccess: () => router.push("mypage") });
  const { data: bouquets } = trpc.bouquets.useQuery();

  const { onChange: _, ...registerBouquetId } = register("bouquetId");
  const { onChange: __, ...registerDeliveryDate } = register("deliveryDate");

  return (
    <CustomerLayout>
      <Container size="md">
        <Form onSubmit={(values) => placeOrder.mutate(values)}>
          {/* ご注文花束 */}
          <Select
            label="花束"
            data={bouquets ? bouquets.map((bouquet) => ({ label: bouquet.name, value: bouquet.id.toString() })) : []}
            onChange={(value) => value && setValue("bouquetId", Number(value))}
            {...registerBouquetId}
          />
          <DateInput
            label="お届け日"
            {...registerDeliveryDate}
            onChange={(date) => date && setValue("deliveryDate", date)}
            withAsterisk
            error={errors.deliveryDate?.message}
          />
          <TextInput label="贈り主氏名" {...register("senderName")} withAsterisk error={errors.senderName?.message} />
          <TextInput
            label="お届け先住所1"
            {...register("deliveryAddress1")}
            withAsterisk
            error={errors.deliveryAddress1?.message}
          />
          <TextInput label="お届け先住所2" {...register("deliveryAddress2")} error={errors.deliveryAddress2?.message} />
          {/* <TextInput label="お届け先氏名" /> */}
          <TextInput
            label="お届けメッセージ"
            {...register("deliveryMessage")}
            error={errors.deliveryMessage?.message}
          />
          <Button type="submit" mt="sm" loading={placeOrder.isLoading}>
            注文する
          </Button>
        </Form>
      </Container>
    </CustomerLayout>
  );
}

PlaceOrder.Middleware = CusotmerMiddleware;
