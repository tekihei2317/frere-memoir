import { initMiddleware } from "@/lib/react-middleware";
import { FrereUser } from "@frere/api-schema";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "./trpc";

type UserState = { isLoading: true } | { isLoading: false; value: FrereUser | undefined };

export function useMiddlewareContext() {
  const { isLoading, data, isError } = trpc.user.useQuery();
  const userState: UserState = isLoading
    ? { isLoading: true }
    : isError
    ? { isLoading: false, value: undefined }
    : { isLoading: false, value: data };

  return { user: userState };
}

export type Context = ReturnType<typeof useMiddlewareContext>;

const { MiddlewareComponent, createMiddleware } = initMiddleware<Context>();

const Loading = () => <div>ローディング中...</div>;
const Unauthorized = () => <div>権限がありません</div>;

const Redirect = ({ to }: { to: string }) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return <></>;
};

const ensureLoggedIn = createMiddleware(({ ctx, next }) => {
  if (ctx.user.isLoading) return <Loading />;
  if (!ctx.user.value) return <Redirect to="/login" />;

  return next({ user: ctx.user.value });
});

// TODO: 上のミドルウェアにパイプする
const ensureUserIsAdmin = createMiddleware(({ ctx, next }) => {
  if (ctx.user.isLoading) return <Loading />;
  if (!ctx.user.value) return <Redirect to="/login" />;
  if (ctx.user.value.type !== "admin") return <Unauthorized />;

  return next({ user: ctx.user.value });
});

export const PublicMiddleware = MiddlewareComponent;
export const AuthMiddleware = MiddlewareComponent.use(ensureLoggedIn);
export const AdminMiddleware = MiddlewareComponent.use(ensureUserIsAdmin);
