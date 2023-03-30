import { CustomerLayout } from "@/components/CustomerLayout";
import { UnauthenticatedMiddleware } from "@/utils/middleware";
import { trpc } from "@/utils/trpc";
import { TextInput, Button, Box, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";

type LoginCredentials = {
  email: string;
  password: string;
};

const Login = () => {
  const form = useForm<LoginCredentials>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      password: (value) => (value.length < 4 ? "パスワードは4文字以上で入力してください" : null),
    },
  });
  const utils = trpc.useContext();
  const login = trpc.login.useMutation({
    onSuccess: (user) => {
      utils.user.setData(undefined, user);
    },
  });

  return (
    <CustomerLayout>
      <Box maw={480} mx="auto">
        <form onSubmit={form.onSubmit((values) => login.mutate({ ...values, type: "customer" }))}>
          <TextInput label="メールアドレス" {...form.getInputProps("email")} />
          <TextInput type="password" label="パスワード" {...form.getInputProps("password")} />
          <Box mt="md">
            <Button type="submit" loading={login.isLoading}>
              ログイン
            </Button>
          </Box>
        </form>
        <Group mt="md" spacing="sm">
          <Link href="/password-reset">パスワードを忘れた場合</Link>
          <Box>|</Box>
          <Link href="/register">新規登録はこちら</Link>
        </Group>
      </Box>
    </CustomerLayout>
  );
};

Login.Middleware = UnauthenticatedMiddleware;

export default Login;
