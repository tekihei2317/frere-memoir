import { CustomerLayout } from "@/components/CustomerLayout";
import { useZodForm } from "@/components/Form";
import { trpc } from "@/utils/trpc";
import { AdminLoginInput } from "@frere/api-schema";
import { TextInput, Button, Box } from "@mantine/core";

const AdminLoginForm = AdminLoginInput.omit({ type: true });

const Login = () => {
  const {
    Form,
    register,
    formState: { errors },
  } = useZodForm(AdminLoginForm);
  const utils = trpc.useContext();
  const login = trpc.login.useMutation({
    onSuccess: (user) => {
      utils.user.setData(undefined, user);
    },
  });

  return (
    <CustomerLayout>
      <Box maw={480} mx="auto">
        <Form onSubmit={(values) => login.mutate({ ...values, type: "admin" })}>
          <TextInput label="メールアドレス" error={errors.email?.message} {...register("email")} />
          <TextInput type="password" label="パスワード" error={errors.password?.message} {...register("password")} />
          <Box mt="md">
            <Button type="submit">ログイン</Button>
          </Box>
        </Form>
      </Box>
    </CustomerLayout>
  );
};

export default Login;
