import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChakraProvider } from "../providers/ChakraProvider";
import { UtmTracker } from "../components/UtmTracker";
import { Suspense } from "react";
import { AuthProvider } from "../providers/AuthContext";
import { CartProvider } from "../providers/CartContext";
import { Footer } from "@/components/Footer";
import { PaymentOfflineSync } from "../components/PaymentOfflineSync";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://picklehub.com'),
  title: "Pickle Hub — Authentic Traditional Rajasthani Pickles",
  description:
    "Buy authentic, homemade traditional Rajasthani pickles online. From spicy mango to mixed veg, taste the true tradition. No preservatives, 100% natural, delivered to your door.",
  keywords:
    "Achar, Achaar, Pickle, Homemade achar, Ghar ka achar, Desi achar, Traditional achar, Handmade achar, Pure achar, Oil pickle, Marwadi achar, Rajasthani achar, Rajasthan pickle, Marwari mango pickle, Keri ka achar, Kairi ka achar, Marwadi keri achar, Marwadi mirchi achar, Rajasthan homemade pickle, आम का अचार, नींबू का अचार, मिर्च का अचार, लहसुन का अचार, मिक्स अचार, घर का अचार, देसी अचार, राजस्थानी अचार, मारवाड़ी अचार, बिना प्रिजर्वेटिव अचार, Mango pickle, Lemon pickle, Green chilli pickle, Red chilli pickle, Garlic pickle, Mixed pickle, Stuffed red chilli pickle, Sweet mango pickle, Spicy mango pickle, Ker Sangri pickle, Buy achar online, Best achar online, Homemade pickle online, Achar delivery, Pickle near me, Authentic Rajasthani achar, Organic pickle, No preservative pickle, Homemade mango pickle, Sikar Achar online",
  openGraph: {
    title: "Pickle Hub — Authentic Traditional Rajasthani Pickles",
    description: "Authentic homemade Rajasthani pickles delivered to your door. Pure, organic, and preservative-free.",
    type: "website",
    siteName: "Pickle Hub",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pickle Hub — Authentic Traditional Rajasthani Pickles',
    description: 'Authentic homemade Rajasthani pickles delivered to your door. Pure, organic, and preservative-free.',
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
    <html lang="en" className={inter.className} suppressHydrationWarning>
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
          <PaymentOfflineSync />
        </ChakraProvider>
      </body>
    </html>
  );
}
