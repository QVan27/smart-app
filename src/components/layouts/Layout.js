import React from "react";
import Header from '@components/Header'
import Footer from '@components/Footer'
import { Nunito } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 700],
})

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main id="main" className={nunito.className}>{children}</main>
      <Footer />
    </>
  );
}

