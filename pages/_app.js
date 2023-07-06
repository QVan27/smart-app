import React, { useEffect } from "react";
import Head from "next/head";
import Layout from "@components/layouts/Layout";
import { useRouter } from 'next/router';
import "@styles/reset.css";
import "@styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const isPublicPage = ['/auth/signin', '/auth/signup'].includes(router.pathname);

    if (!accessToken && !isPublicPage) {
      router.push('/auth/signin');
    }
  }, []);

  const renderWithLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {renderWithLayout(<Component {...pageProps} />)}
    </>
  );
}
