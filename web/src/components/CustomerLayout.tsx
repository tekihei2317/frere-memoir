import { Box, Text, Title } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";

export const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>フレール・メモワール</title>
        <meta name="description" content="仮想のフラーワーショップ「フレール・メモワール」のWebサイトです" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box component="main" p="xs">
        <Title order={1} size="h2">
          <Text component={Link} href="/">
            フレール・メモワール
          </Text>
        </Title>
        {children}
      </Box>
    </>
  );
};
