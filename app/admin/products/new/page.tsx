
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import adminApi from "@/lib/api/admin-client";

type Category = {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  slug: string;
};

type CategoriesResponse = {
  success: boolean;
  categories: Category[];
};

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    nameEn: "",
    nameAr: "",
    slug: "",
    descriptionEn: "",
    descriptionAr: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "0",
    isFeatured: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const response =
          await adminApi.get<CategoriesResponse>("/categories");

        if (!response.data.success) {
          throw new Error("Unable to load categories");
        }

        if (!cancelled) {
          setCategories(response.data.categories);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Could not load categories. Please sign in again or retry."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      nameEn: value,
      slug:
        current.slug === "" ||
        current.slug === slugify(current.nameEn)
          ? slugify(value)
          : current.slug,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const price = Number(form.price);
    const originalPrice =
      form.originalPrice.trim() === ""
        ? undefined
        : Number(form.originalPrice);
    const stock = Number(form.stock);

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      (originalPrice !== undefined &&
        (!Number.isFinite(originalPrice) || originalPrice < 0)) ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError("Enter valid prices and a whole-number stock quantity.");
      return;
    }

    if (
      originalPrice !== undefined &&
      originalPrice < price
    ) {
      setError("Original price should be equal to or greater than the selling price.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        slug: slugify(form.slug),
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
        images: [],
        isFeatured: form.isFeatured,
        stock,
      };

      const response = await adminApi.post(
        "/products",
        payload
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Product creation failed."
        );
      }

      setSuccess("Product created successfully.");

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            `Unable to create product (HTTP ${err.response?.status ?? "network error"}).`
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <a
          href="/admin/products"
          className="text-sm text-neutral-600 hover:underline"
        >
          ← Back to products
        </a>

        <h1 className="mt-5 text-3xl font-semibold text-green-950">
          Add product
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Add a jewellery product to your catalogue.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-xl border bg-white p-5 sm:p-8"
        >
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Product details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name (English)">
                <input
                  required
                  maxLength={150}
                  value={form.nameEn}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={inputClass}
                  placeholder="Gold Necklace"
                />
              </Field>

              <Field label="Product name (Arabic)">
                <input
                  required
                  maxLength={150}
                  dir="rtl"
                  value={form.nameAr}
                  onChange={(e) => updateField("nameAr", e.target.value)}
                  className={inputClass}
                  placeholder="قلادة ذهبية"
                />
              </Field>
            </div>

            <Field label="Product slug">
              <input
                required
                maxLength={180}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className={inputClass}
                placeholder="gold-necklace"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Lowercase letters, numbers and hyphens only. Must be unique.
              </p>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Description (English)">
                <textarea
                  required
                  rows={4}
                  maxLength={5000}
                  value={form.descriptionEn}
                  onChange={(e) =>
                    updateField("descriptionEn", e.target.value)
                  }
                  className={inputClass}
                  placeholder="Describe the jewellery..."
                />
              </Field>

              <Field label="Description (Arabic)">
                <textarea
                  required
                  rows={4}
                  maxLength={5000}
                  dir="rtl"
                  value={form.descriptionAr}
                  onChange={(e) =>
                    updateField("descriptionAr", e.target.value)
                  }
                  className={inputClass}
                  placeholder="وصف المنتج..."
                />
              </Field>
            </div>
          </section>

          <hr />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Pricing and inventory</h2>

            <Field label="Category">
              <select
                required
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                disabled={loadingCategories}
                className={inputClass}
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name.en}
                  </option>
                ))}
              </select>

              {!loadingCategories && categories.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  No categories found. Create a category first.
                </p>
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Selling price (₹)">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className={inputClass}
                  placeholder="25000"
                />
              </Field>

              <Field label="Original price (₹)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={(e) =>
                    updateField("originalPrice", e.target.value)
                  }
                  className={inputClass}
                  placeholder="28000"
                />
              </Field>

              <Field label="Stock quantity">
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <label className="flex items-center gap-3 rounded-lg border p-4">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  updateField("isFeatured", e.target.checked)
                }
                className="size-4 accent-green-800"
              />
              <span>
                <span className="block font-medium">Featured product</span>
                <span className="text-sm text-neutral-500">
                  Mark this product as featured.
                </span>
              </span>
            </label>
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
            >
              {success}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="rounded-lg border px-5 py-3 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loadingCategories || categories.length === 0}
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 disabled:bg-neutral-100";
