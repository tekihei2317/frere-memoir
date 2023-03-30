import { Container, Text } from "@mantine/core";

export default function RegistrationPending() {
  return (
    <Container size="sm" mt="md">
      <Text>登録確認メールを送信しました。登録を完了するためには、送信したメールのリンクをクリックしてください。</Text>
    </Container>
  );
}
