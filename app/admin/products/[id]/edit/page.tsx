
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import adminApi from "@/lib/api/admin-client";
import type { Product } from "@/types/product";

type Category = {
  _id: string;
  name: { en: string; ar: string };
  slug: string;
};

type ProductListResponse = {
  success: boolean;
  products: Product[];
};

type CategoriesResponse = {
  success: boolean;
  categories: Category[];
};

type ProductForm = {
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  isFeatured: boolean;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 disabled:bg-neutral-100";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      `Request failed (${error.response?.status ?? "network error"}).`
    );
  }

  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>({
    slug: "",
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "0",
    isFeatured: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadedProduct, setLoadedProduct] = useState<Product | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productResponse, categoryResponse] = await Promise.all([
        adminApi.get<ProductListResponse>("/products", {
          params: { limit: 1000 },
        }),
        adminApi.get<CategoriesResponse>("/categories"),
      ]);

      if (!productResponse.data?.success ||
          !Array.isArray(productResponse.data.products)) {
        throw new Error("Invalid products response.");
      }

      if (!categoryResponse.data?.success ||
          !Array.isArray(categoryResponse.data.categories)) {
        throw new Error("Invalid categories response.");
      }

      const product = productResponse.data.products.find(
        (item) => item._id === id
      );

      if (!product) {
        throw new Error(
          "Product not found. Return to the product list and try again."
        );
      }

      setLoadedProduct(product);
      setCategories(categoryResponse.data.categories);

      setForm({
        slug: product.slug ?? "",
        nameEn: product.name?.en ?? "",
        nameAr: product.name?.ar ?? "",
        descriptionEn: product.description?.en ?? "",
        descriptionAr: product.description?.ar ?? "",
        category:
          typeof product.category === "string"
            ? product.category
            : product.category?._id ?? "",
        price: String(product.price ?? ""),
        originalPrice:
          product.originalPrice != null
            ? String(product.originalPrice)
            : "",
        stock: String(product.stock ?? 0),
        isFeatured: Boolean(product.isFeatured),
      });
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 401
      ) {
        router.replace("/admin/login");
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const slug = form.slug.trim();
    const price = Number(form.price);
    const originalPrice =
      form.originalPrice.trim() === ""
        ? undefined
        : Number(form.originalPrice);
    const stock = Number(form.stock);

    if (
      !form.nameEn.trim() ||
      !form.nameAr.trim() ||
      !form.descriptionEn.trim() ||
      !form.descriptionAr.trim() ||
      !form.category
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Slug must contain lowercase letters, numbers, and hyphens.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid selling price.");
      return;
    }

    if (
      originalPrice !== undefined &&
      (!Number.isFinite(originalPrice) || originalPrice < 0)
    ) {
      setError("Enter a valid original price.");
      return;
    }

    if (
      originalPrice !== undefined &&
      originalPrice < price
    ) {
      setError("Original price should be equal to or greater than selling price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        slug,
        name: {
          en: form.nameEn.trim(),
          ar: form.nameAr.trim(),
        },
        description: {
          en: form.descriptionEn.trim(),
          ar: form.descriptionAr.trim(),
        },
        category: form.category,
        price,
        ...(originalPrice !== undefined ? { originalPrice } : {}),
        stock,
        isFeatured: form.isFeatured,
        // Preserve existing image URLs until image management is implemented.
        images: loadedProduct?.images ?? [],
      };

      const response = await adminApi.patch(
        `/products/${encodeURIComponent(id)}`,
        payload
      );

      if (response.data?.success !== true) {
        throw new Error(
          response.data?.message || "Product update failed."
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 401
      ) {
        router.replace("/admin/login");
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 p-8">
        Loading product...
      </main>
    );
  }

  if (!loadedProduct) {
    return (
      <main className="min-h-screen bg-neutral-50 p-8">
        <p role="alert" className="text-red-700">
          {error || "Product could not be loaded."}
        </p>
        <button
          type="button"
          onClick={() => void loadData()}
          className="mt-4 rounded-lg border px-4 py-2"
        >
          Retry
        </button>
        <Link
          href="/admin/products"
          className="ml-3 text-sm underline"
        >
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Back to products
        </Link>

        <h1 className="mt-4 text-3xl font-semibold text-neutral-900">
          Edit product
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Update {loadedProduct.name.en}.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8 rounded-xl border border-neutral-200 bg-white p-5 sm:p-8"
        >
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <section>
            <h2 className="text-lg font-semibold">Product information</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Product name (English)">
                <input
                  required
                  maxLength={150}
                  className={inputClass}
                  value={form.nameEn}
                  onChange={(e) => updateField("nameEn", e.target.value)}
                />
              </Field>

              <Field label="Product name (Arabic)">
                <input
                  required
                  maxLength={150}
                  dir="rtl"
                  className={inputClass}
                  value={form.nameAr}
                  onChange={(e) => updateField("nameAr", e.target.value)}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Slug">
                  <input
                    required
                    maxLength={180}
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    className={inputClass}
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Description (English)">
                <textarea
                  required
                  rows={4}
                  className={inputClass}
                  value={form.descriptionEn}
                  onChange={(e) =>
                    updateField("descriptionEn", e.target.value)
                  }
                />
              </Field>

              <Field label="Description (Arabic)">
                <textarea
                  required
                  rows={4}
                  dir="rtl"
                  className={inputClass}
                  value={form.descriptionAr}
                  onChange={(e) =>
                    updateField("descriptionAr", e.target.value)
                  }
                />
              </Field>
            </div>
          </section>

          <section className="border-t border-neutral-200 pt-6">
            <h2 className="text-lg font-semibold">Category and pricing</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Category">
                <select
                  required
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name.en} — {category.name.ar}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Selling price (₹)">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                />
              </Field>

              <Field label="Original price (₹)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.originalPrice}
                  onChange={(e) =>
                    updateField("originalPrice", e.target.value)
                  }
                />
              </Field>

              <Field label="Stock quantity">
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  className={inputClass}
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className="border-t border-neutral-200 pt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  updateField("isFeatured", e.target.checked)
                }
                className="size-4"
              />
              <span className="text-sm font-medium">
                Featured product
              </span>
            </label>
          </section>

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-neutral-200 pt-6 sm:flex-row">
            <Link
              href="/admin/products"
              className="rounded-lg border border-neutral-300 px-5 py-3 text-center text-sm"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || categories.length === 0}
              className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
    </div>
  );
}
