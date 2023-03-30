import { AdminLayout } from "@/components/AdminLayout";
import { InferMiddlewareProps } from "@/lib/react-middleware";
import { AdminMiddleware } from "@/utils/middleware";

export default function Bouquets({}: InferMiddlewareProps<typeof AdminMiddleware>) {
  return <AdminLayout>花束一覧</AdminLayout>;
}

Bouquets.Middleware = AdminMiddleware;
