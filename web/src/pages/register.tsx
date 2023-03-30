import { CustomerLayout } from "@/components/CustomerLayout";
import { UnauthenticatedMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { TextInput, Button, Box, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/router";

type RegistrationInfo = {
  email: string;
  name: string;
  password: string;
};

export default function Register() {
  const router = useRouter();
  const register = trpc.register.useMutation({
    onSuccess: () => router.push("/registration-pending"),
  });
  const form = useForm<RegistrationInfo>({
    validate: {
      password: (value) => (value.length < 4 ? "パスワードは4文字以上で入力してください" : null),
    },
  });

  return (
    <CustomerLayout>
      <Box maw={480} mx="auto">
        <form onSubmit={form.onSubmit((values) => register.mutate(values))}>
          <TextInput label="メールアドレス" {...form.getInputProps("email")} />
          <TextInput type="password" label="パスワード" {...form.getInputProps("password")} />
          <TextInput label="氏名" {...form.getInputProps("name")} />
          <Box mt="md">
            <Button type="submit">登録</Button>
          </Box>
        </form>
        <Group mt="md" spacing="sm">
          <Link href="/login">ログインはこちら</Link>
        </Group>
      </Box>
    </CustomerLayout>
  );
}

Register.Middleware = UnauthenticatedMiddleware;
