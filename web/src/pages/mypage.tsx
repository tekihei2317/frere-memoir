import { CustomerLayout } from "@/components/CustomerLayout";
import { CusotmerMiddleware } from "@/utils/middleware";
import { Box, Button, Container, Group, Title } from "@mantine/core";
import Link from "next/link";

export default function MyPage() {
  return (
    <CustomerLayout>
      <Container size="md">
        <Group position="right">
          <Button component={Link} href="/place-order">
            注文する
          </Button>
        </Group>
        <Box>
          <Title order={2} size="h3">
            注文履歴
          </Title>
        </Box>
      </Container>
    </CustomerLayout>
  );
}

MyPage.Middleware = CusotmerMiddleware;
