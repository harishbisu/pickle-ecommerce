import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChakraProvider } from "../providers/ChakraProvider";
import { UtmTracker } from "../components/UtmTracker";
import { Suspense } from "react";
import { AuthProvider } from "../providers/AuthContext";
import { CartProvider } from "../providers/CartContext";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pickle Hub — Authentic Traditional Pickles",
  description:
    "Buy authentic, homemade traditional pickles online. From spicy mango to mixed veg, taste the tradition. Fresh, natural, and delivered to your door.",
  keywords:
    "pickles, mango pickle, traditional pickles, buy pickles online india, homemade achaar",
  openGraph: {
    title: "Pickle Hub — Authentic Traditional Pickles",
    description: "Authentic homemade pickles delivered to your door.",
    type: "website",
    siteName: "Pickle Hub",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <UtmTracker />
        </Suspense>
        <ChakraProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
          <Footer />
        </ChakraProvider>
      </body>
    </html>
  );
}
