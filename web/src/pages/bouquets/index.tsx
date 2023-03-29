import { AdminLayout } from "@/components/AdminLayout";
import { InferMiddlewareProps } from "@/lib/react-middleware";
import { AdminMiddleware } from "@/utils/middleware";

const Bouquets = ({}: InferMiddlewareProps<typeof AdminMiddleware>) => {
  return <AdminLayout>花束一覧</AdminLayout>;
};

Bouquets.Middleware = AdminMiddleware;

export default Bouquets;
