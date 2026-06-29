import { Metadata } from "next";
import ProductClient from "./ProductClient";

async function getProduct(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.find((p: any) => p.slug === slug || p.id === slug) || null;
    }
  } catch (error) {
    console.error("Failed to fetch product", error);
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found — Pickle Hub",
    };
  }

  const title = `${product.name} — Authentic Rajasthani Achar | Pickle Hub`;
  const description = product.description.substring(0, 160);
  const images = product.images?.length > 0 ? product.images : ["/logo.webp"];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: images.map((url: string) => ({ url, width: 800, height: 600, alt: product.name })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  let jsonLd = null;
  if (product) {
    const priceAfterDiscount = parseFloat(product.price) - (product.discount ? parseFloat(product.discount) : 0);
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.images?.[0] || "",
      description: product.description,
      sku: product.id,
      offers: {
        "@type": "Offer",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://picklehub.com"}/shop/${product.slug || product.id}`,
        priceCurrency: "INR",
        price: priceAfterDiscount,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient initialProduct={product} />
    </>
  );
}
