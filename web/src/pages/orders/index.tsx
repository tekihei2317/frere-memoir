import { AdminLayout } from "@/components/AdminLayout";
import { AuthMiddleware } from "@/utils/middleware";

const BouquetOrders = () => {
  return <AdminLayout>花束一覧</AdminLayout>;
};

BouquetOrders.Middleware = AuthMiddleware;

export default BouquetOrders;
