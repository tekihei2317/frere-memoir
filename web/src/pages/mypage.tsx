import { CustomerLayout } from "@/components/CustomerLayout";
import { CusotmerMiddleware } from "@/utils/middleware";

export default function MyPage() {
  return <CustomerLayout>マイページ</CustomerLayout>;
}

MyPage.Middleware = CusotmerMiddleware;
