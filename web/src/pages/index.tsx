import { CustomerLayout } from "@/components/CustomerLayout";
import { Anchor, Container, Text, Stack, Button, Group } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <CustomerLayout>
      <Container size="md" mt="sm">
        <Stack>
          <Text>
            <Anchor href="https://www.benkyoenkai.org/contents/Bouquet1-2" target="_blank">
              花束問題
            </Anchor>
            を想定して作成したWebアプリケーションです。花束問題は、在庫管理を含む比較的複雑な要件をもとにしたデータモデリングの問題です。
          </Text>
          <Text>
            コードは
            <Anchor href="https://github.com/GIBJapan/menzei-app" target="_blank">
              GitHubリポジトリ
            </Anchor>
            にあります。フロントエンドはNext.js、バックエンドは@trpc/serverとPrismaで実装しています。
          </Text>
          <Text>
            開発ログは
            <Anchor href="https://zenn.dev/tekihei2317/scraps/6e483b6a4dd30f" target="_blank">
              Zennのスクラップ
            </Anchor>
            にまとめています。
          </Text>
          <Group>
            <Button component={Link} href="/login">
              顧客としてログインする
            </Button>
            <Button component={Link} href="/admin">
              管理者としてログインする
            </Button>
            <Button component={Link} href="/register">
              ユーザー登録する
            </Button>
          </Group>
        </Stack>
      </Container>
    </CustomerLayout>
  );
}
