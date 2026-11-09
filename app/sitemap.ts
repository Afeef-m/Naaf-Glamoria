
import type { MetadataRoute } from "next";

const siteUrl = "https://naaf-glamoria-two.vercel.app";
const apiUrl = process.env.BACKEND_API_URL;

interface Product {
  slug: string;
  updatedAt?: string;
}

interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination?: {
    pages: number;
  };
}

async function getAllProducts(): Promise<Product[]> {
  if (!apiUrl) {
    console.error("BACKEND_API_URL is not configured.");
    return [];
  }

  try {
    const firstResponse = await fetch(
      `${apiUrl}/products?page=1&limit=100`,
      { next: { revalidate: 3600 } }
    );

    if (!firstResponse.ok) {
      throw new Error(`Products API returned ${firstResponse.status}`);
    }

    const firstData: ProductsResponse = await firstResponse.json();

    if (!firstData.success || !Array.isArray(firstData.products)) {
      throw new Error("Invalid products API response.");
    }

    const products = [...firstData.products];
    const totalPages = Math.min(
      Math.max(firstData.pagination?.pages ?? 1, 1),
      100
    );

    for (let page = 2; page <= totalPages; page++) {
      const response = await fetch(
        `${apiUrl}/products?page=${page}&limit=100`,
        { next: { revalidate: 3600 } }
      );

      if (!response.ok) {
        throw new Error(`Products page ${page} failed.`);
      }

      const data: ProductsResponse = await response.json();

      if (!data.success || !Array.isArray(data.products)) {
        throw new Error(`Invalid products response on page ${page}.`);
      }

      products.push(...data.products);
    }

    return products;
  } catch (error) {
    console.error("Sitemap product fetching failed:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/en`,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          ar: `${siteUrl}/ar`,
        },
      },
    },
    {
      url: `${siteUrl}/ar`,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          ar: `${siteUrl}/ar`,
        },
      },
    },
    {
      url: `${siteUrl}/en/about`,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          en: `${siteUrl}/en/about`,
          ar: `${siteUrl}/ar/about`,
        },
      },
    },
    {
      url: `${siteUrl}/ar/about`,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          en: `${siteUrl}/en/about`,
          ar: `${siteUrl}/ar/about`,
        },
      },
    },
    {
      url: `${siteUrl}/en/products`,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/en/products`,
          ar: `${siteUrl}/ar/products`,
        },
      },
    },
    {
      url: `${siteUrl}/ar/products`,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/en/products`,
          ar: `${siteUrl}/ar/products`,
        },
      },
    },
  ];

  const products = await getAllProducts();

  const productPages: MetadataRoute.Sitemap = products.flatMap(
    (product) => {
      if (!product.slug) return [];

      const enUrl = `${siteUrl}/en/products/${product.slug}`;
      const arUrl = `${siteUrl}/ar/products/${product.slug}`;

      return [
        {
          url: enUrl,
          lastModified: product.updatedAt
            ? new Date(product.updatedAt)
            : undefined,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              en: enUrl,
              ar: arUrl,
            },
          },
        },
        {
          url: arUrl,
          lastModified: product.updatedAt
            ? new Date(product.updatedAt)
            : undefined,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              en: enUrl,
              ar: arUrl,
            },
          },
        },
      ];
    }
  );

  return [...staticPages, ...productPages];
}
