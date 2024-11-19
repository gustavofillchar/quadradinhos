'use client'

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/header/header.component";
import { CounterProvider } from "./contexts/CounterContext";
import Footer from "./components/footer/footer.component";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <title>Quadradinho Premiado - Compre para divulgar e concorra a sorteios</title>
        <meta name="description" content="Quadradinho Premiado - Ganhe automaticamente um cupom para concorrer a um iPhone 16 Pro Max" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CounterProvider>
          <Header />
          {children}
          <Footer />
        </CounterProvider>
      </body>
    </html>
  );
}