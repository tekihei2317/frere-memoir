import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { trpc } from "@/utils/trpc";
import { DatesProvider } from "@mantine/dates";
import dynamic from "next/dynamic";
import { Notifications } from "@mantine/notifications";

function App({ Component, pageProps }: AppProps) {
  const AvoidSsr = dynamic(() => import("../components/AvoidSsr").then((module) => module.AvoidSsr), { ssr: false });

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
          <Component {...pageProps} />
        </DatesProvider>
      </MantineProvider>
    </AvoidSsr>
  );
}

export default trpc.withTRPC(App);
