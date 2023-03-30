import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { trpc } from "@/utils/trpc";
import { DatesProvider } from "@mantine/dates";
import dynamic from "next/dynamic";
import { Notifications } from "@mantine/notifications";
import { MiddlewareComponent } from "@/lib/react-middleware";
import { Context, PublicMiddleware, useMiddlewareContext } from "@/utils/middleware";

function App<OutputContext>({
  Component,
  pageProps,
}: AppProps & { Component: { Middleware?: MiddlewareComponent<Context, OutputContext> } }) {
  const AvoidSsr = dynamic(() => import("../components/AvoidSsr").then((module) => module.AvoidSsr), { ssr: false });
  const { Middleware = PublicMiddleware } = Component;

  return (
    <AvoidSsr>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <Notifications position="top-right" />
        {/* locale: jaが機能していないっぽい */}
        <DatesProvider settings={{ locale: "ja", firstDayOfWeek: 0 }}>
          <Middleware ctx={useMiddlewareContext()}>{(ctx) => <Component ctx={ctx} {...pageProps} />}</Middleware>
        </DatesProvider>
      </MantineProvider>
    </AvoidSsr>
  );
}

export default trpc.withTRPC(App);
