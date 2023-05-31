import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import Layout from "@/components/Layout";

import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default MyApp;
