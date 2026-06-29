import { Metadata } from "next";
import HomeClient from "./HomeClient";

// SEO generateMetadata function
export async function generateMetadata(): Promise<Metadata> {
  const title = "Authentic Homemade Pickles — Pickle Hub";
  const description =
    "Shop the best authentic Rajasthani pickles online. Buy homemade mango, lemon, garlic, and mixed achar made with love and no preservatives.";
  const keywords = "Buy achar online, Best achar online, Homemade pickle online, Authentic Rajasthani achar, Organic pickle, No preservative pickle, Homemade mango pickle";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/home.jpeg",
          width: 1200,
          height: 630,
          alt: "Pickle Hub Home",
        },
      ],
    },
  };
}

export default async function Page() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  let initialFeaturedProducts = [];

  try {
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const featured = data.filter((p: any) => p.isFeatured);
      initialFeaturedProducts = featured.length >= 3 ? featured.slice(0, 3) : data.slice(0, 3);
    }
  } catch (error) {
    console.error("Failed to fetch featured products server-side", error);
  }

  // Organization structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pickle Hub",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://picklehub.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://picklehub.com"}/logo.webp`,
    description: "Authentic handmade Rajasthani pickles and achar.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9999999999",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient initialFeaturedProducts={initialFeaturedProducts} />
    </>
  );
}
