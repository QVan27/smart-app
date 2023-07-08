import React, { useEffect, useState } from "react";
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

  const [isOnline, setIsOnline] = useState(true)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'ononline' in window && 'onoffline' in window) {
      setIsOnline(window.navigator.onLine)
      if (!window.ononline) {
        window.addEventListener('online', () => {
          setIsOnline(true)
        })
      }
      if (!window.onoffline) {
        window.addEventListener('offline', () => {
          setIsOnline(false)
        })
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined && isOnline) {
      // skip index route, because it's already cached under `start-url` caching object
      if (router.route !== '/') {
        const wb = window.workbox
        wb.active.then(worker => {
          wb.messageSW({ action: 'CACHE_NEW_ROUTE' })
        })
      }
    }
  }, [isOnline, router.route])

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
        <title>Smart</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' />
      </Head>
      {renderWithLayout(<Component {...pageProps} />)}
    </>
  );
}