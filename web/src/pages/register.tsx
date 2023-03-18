import { TextInput, Button, Box, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";

type RegistrationInfo = {
  email: string;
  userName: string;
  password: string;
};

const Login = () => {
  const form = useForm<RegistrationInfo>({
    validate: {
      password: (value) => (value.length < 4 ? "パスワードは4文字以上で入力してください" : null),
    },
  });

  return (
    <Box maw={480} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput label="メールアドレス" {...form.getInputProps("email")} />
        <TextInput type="password" label="パスワード" {...form.getInputProps("password")} />
        <TextInput label="氏名" {...form.getInputProps("userName")} />
        <Box mt="md">
          <Button type="submit">登録</Button>
        </Box>
      </form>
      <Group mt="md" spacing="sm">
        <Link href="/login">ログインはこちら</Link>
      </Group>
    </Box>
  );
};

export default Login;
