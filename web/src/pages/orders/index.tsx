import { AdminLayout } from "@/components/AdminLayout";
import { AdminMiddleware } from "@/utils/middleware";

export default function BouquetOrders() {
  return <AdminLayout>注文一覧</AdminLayout>;
}

BouquetOrders.Middleware = AdminMiddleware;
