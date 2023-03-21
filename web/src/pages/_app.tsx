import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { trpc } from "@/utils/trpc";

function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default trpc.withTRPC(App);
