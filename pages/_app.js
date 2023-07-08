import React, { useEffect } from "react";
import RoleProtectedRoute from "@utils/roleProtectedRoute";
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
  }, [router]);

  const renderWithLayout = Component.getLayout || ((page) => {
    const allowedRoles = [];

    if (router.pathname === '/employees/create') allowedRoles.push('ADMIN');
    if (router.pathname === '/manage-bookings') allowedRoles.push('MODERATOR', 'ADMIN');

    if (allowedRoles.length > 0) {
      return (
        <Layout>
          <RoleProtectedRoute allowedRoles={allowedRoles}>
            {page}
          </RoleProtectedRoute>
        </Layout>
      );
    }

    return <Layout>{page}</Layout>;
  });

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