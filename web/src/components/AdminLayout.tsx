import { Box, Tabs, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const activeTab = router.pathname;

  return (
    <Box>
      <Box py="xs" px="xs">
        <Title order={1} size="h2">
          frere-memoir
        </Title>
      </Box>
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
