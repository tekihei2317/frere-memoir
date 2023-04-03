import { trpc } from "@/utils/trpc";
import { Box, Button, Flex, Tabs, Title } from "@mantine/core";
import { useRouter } from "next/router";

function rootPagePath(path: string): string {
  return path.split("/").slice(0, 2).join("/");
}

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const activeTab = rootPagePath(router.pathname);
  const utils = trpc.useContext();
  const logout = trpc.logout.useMutation({
    onSuccess: () => {
      utils.user.invalidate();
    },
  });

  return (
    <Box>
      <Flex py="xs" px="xs" justify="space-between">
        <Title order={1} size="h2">
          frere-memoir
        </Title>
        <Button variant="outline" loading={logout.isLoading} onClick={() => logout.mutate()}>
          ログアウト
        </Button>
      </Flex>
      <Tabs value={activeTab} onTabChange={(value) => router.push(`${value}`)} px="xs">
        <Tabs.List>
          <Tabs.Tab value="/orders">注文</Tabs.Tab>
          <Tabs.Tab value="/purchases">仕入れ</Tabs.Tab>
          <Tabs.Tab value="/inventories">在庫</Tabs.Tab>
          <Tabs.Tab value="/bouquets">花束</Tabs.Tab>
          <Tabs.Tab value="/flowers">花</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Box px="xs" py="xs">
        {children}
      </Box>
    </Box>
  );
};
