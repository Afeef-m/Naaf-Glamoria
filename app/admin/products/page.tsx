
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import adminApi from "@/lib/api/admin-client";
import type { Product } from "@/types/product";

type ProductsResponse = {
  success: boolean;
  products: Product[];
};

type AdminResponse = {
  success: boolean;
  admin?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Verify the current admin session.
      const session = await adminApi.get<AdminResponse>("/auth/me");

      if (!session.data?.success || !session.data?.admin) {
        window.location.assign("/admin/login");
        return;
      }

      // Use the authenticated Next.js proxy, not the public backend URL.
      const response =
        await adminApi.get<ProductsResponse>("/products");

      if (!response.data?.success ||
          !Array.isArray(response.data.products)) {
        throw new Error("The server returned an invalid product list.");
      }

      setProducts(response.data.products);
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 401
      ) {
        window.location.assign("/admin/login");
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return products;

    return products.filter((product) =>
      [
        product.name?.en,
        product.name?.ar,
        product.slug,
        product.category?.name?.en,
        product.category?.name?.ar,
      ].some((value) => value?.toLowerCase().includes(term))
    );
  }, [products, search]);

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name.en}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(product._id);
    setError("");
    setNotice("");

    try {
      const response = await adminApi.delete(
        `/products/${encodeURIComponent(product._id)}`
      );

      if (response.data?.success !== true) {
        throw new Error(
          response.data?.message || "Product deletion failed."
        );
      }

      setProducts((current) =>
        current.filter((item) => item._id !== product._id)
      );
      setNotice(`${product.name.en} was deleted successfully.`);
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 401
      ) {
        window.location.assign("/admin/login");
        return;
      }

      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              "Unable to delete product."
          : err instanceof Error
            ? err.message
            : "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  return (
    <main className="min-h-screen bg-neutral-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              ← Back to dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-semibold text-neutral-900">
              Products
            </h1>

            <p className="mt-1 text-sm text-neutral-600">
              Manage your Naaf Glamoria jewellery catalogue.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700"
          >
            + Add product
          </Link>
        </div>

        <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">All products</h2>
              <p className="mt-1 text-sm text-neutral-500">
                {products.length} product
                {products.length === 1 ? "" : "s"} in your catalogue
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-neutral-700 sm:w-64"
              />

              <button
                type="button"
                onClick={() => void loadProducts()}
                disabled={loading}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
              <button
                type="button"
                onClick={() => void loadProducts()}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {notice && (
            <p
              role="status"
              className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800"
            >
              {notice}
            </p>
          )}

          {loading ? (
            <p className="py-16 text-center text-sm text-neutral-500">
              Loading products...
            </p>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-medium text-neutral-800">
                {search ? "No matching products" : "No products yet"}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                {search
                  ? "Try another product name or category."
                  : "Add your first jewellery product to get started."}
              </p>

              {!search && (
                <Link
                  href="/admin/products/new"
                  className="mt-4 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white"
                >
                  Add your first product
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                    <th className="px-3 py-4 font-medium">Product</th>
                    <th className="px-3 py-4 font-medium">Category</th>
                    <th className="px-3 py-4 font-medium">Price</th>
                    <th className="px-3 py-4 font-medium">Stock</th>
                    <th className="px-3 py-4 font-medium">Featured</th>
                    <th className="px-3 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name.en}
                              className="h-12 w-12 rounded-lg border border-neutral-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-400">
                              No image
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-neutral-900">
                              {product.name.en}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-neutral-600">
                        {product.category?.name?.en || "Uncategorized"}
                      </td>

                      <td className="px-3 py-4 font-medium text-neutral-900">
                        {formatPrice(product.price)}
                        {product.originalPrice != null &&
                          product.originalPrice > product.price && (
                            <p className="mt-1 text-xs text-neutral-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </p>
                          )}
                      </td>

                      <td className="px-3 py-4 text-neutral-600">
                        {product.stock ?? 0}
                      </td>

                      <td className="px-3 py-4">
                        {product.isFeatured ? (
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="text-neutral-400">No</span>
                        )}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${encodeURIComponent(product._id)}/edit`}
                            className="rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-100"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => void handleDelete(product)}
                            disabled={deletingId === product._id}
                            className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
