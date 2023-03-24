import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@frere/trpc";
import { notifications } from "@mantine/notifications";
import superjson from "superjson";

function getBaseUrl(): string {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       **/
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      queryClientConfig: {
        defaultOptions: {
          mutations: {
            retry: false,
            onError(error: unknown) {
              if (error instanceof TRPCClientError) {
                const code = error.data.code;
                const clientErrorCodes = ["BAD_REQUEST", "UNAUTHORIZED", "NOT_FOUND"];
                notifications.show({
                  // title: "エラーが発生しました",
                  message: error.message,
                  color: clientErrorCodes.includes(code) ? "yellow" : "red",
                  autoClose: 5000,
                });
              }
            },
          },
          queries: {
            retry: false,
            onError(error: unknown) {
              if (error instanceof TRPCClientError) {
                const code = error.data.code;
                const clientErrorCodes = ["BAD_REQUEST", "UNAUTHORIZED", "NOT_FOUND"];
                notifications.show({
                  title: "エラーが発生しました",
                  message: error.message,
                  color: clientErrorCodes.includes(code) ? "yellow" : "red",
                });
              }
            },
          },
        },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});
