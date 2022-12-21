import FreelanceToolLayout from "@components/layout/FreelanceToolLayout";
import "@styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient } from "react-query";

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Freelance Tool</title>
      </Head>
      <FreelanceToolLayout queryClient={queryClient}>
        <Component {...pageProps} />
      </FreelanceToolLayout>
    </>
  );
};

export default App;
