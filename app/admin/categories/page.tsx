"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
  categories?: Category[];
  message?: string;
  data?: Category | Category[];
};

type CategoryForm = {
  en: string;
  ar: string;
  slug: string;
};

const emptyForm: CategoryForm = {
  en: "",
  ar: "",
  slug: "",
};

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || error.response?.data?.error || fallback
    );
  }

  return error instanceof Error ? error.message : fallback;
}

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const session = await adminApi.get("/auth/me");

      if (!session.data?.success || !session.data?.admin) {
        window.location.assign("/admin/login");
        return;
      }

      const response = await adminApi.get<CategoriesResponse>("/categories");

      if (
        response.data?.success !== true ||
        !Array.isArray(response.data.categories)
      ) {
        throw new Error(
          response.data?.message || "Invalid categories response.",
        );
      }

      setCategories(response.data.categories);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        window.location.assign("/admin/login");
        return;
      }

      setError(getErrorMessage(err, "Unable to load categories."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function updateField(field: keyof CategoryForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setNotice("");
  }

  function startEdit(category: Category) {
    setEditingId(category._id);
    setForm({
      en: category.name?.en ?? "",
      ar: category.name?.ar ?? "",
      slug: category.slug ?? "",
    });
    setError("");
    setNotice("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const en = form.en.trim();
    const ar = form.ar.trim();
    const slug = form.slug.trim().toLowerCase().replace(/\s+/g, "-");

    if (!en || !ar || !slug) {
      setError("Please fill in both names and the slug.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError(
        "Slug must contain only lowercase letters, numbers, and single hyphens.",
      );
      return;
    }

    const payload = {
      name: { en, ar },
      slug,
    };

    setSaving(true);

    try {
      if (editingId) {
        const response = await adminApi.patch(
          `/categories/${encodeURIComponent(editingId)}`,
          payload,
        );

        if (response.data?.success !== true) {
          throw new Error(
            response.data?.message || "Failed to update category.",
          );
        }

        setNotice("Category updated successfully.");
      } else {
        const response = await adminApi.post("/categories", payload);

        if (response.data?.success !== true) {
          throw new Error(
            response.data?.message || "Failed to create category.",
          );
        }

        setNotice("Category created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadCategories();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        window.location.assign("/admin/login");
        return;
      }

      setError(
        getErrorMessage(
          err,
          editingId
            ? "Unable to update category."
            : "Unable to create category.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Delete category "${category.name.en}"?\n\nThis may fail if products still use this category.`,
    );

    if (!confirmed) return;

    setDeletingId(category._id);
    setError("");
    setNotice("");

    try {
      const response = await adminApi.delete(
        `/categories/${encodeURIComponent(category._id)}`,
      );

      if (response.data?.success !== true) {
        throw new Error(response.data?.message || "Failed to delete category.");
      }

      setCategories((current) =>
        current.filter((item) => item._id !== category._id),
      );

      if (editingId === category._id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      setNotice(`"${category.name.en}" was deleted successfully.`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        window.location.assign("/admin/login");
        return;
      }

      setError(
        getErrorMessage(
          err,
          "Unable to delete category. Check whether products use it.",
        ),
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              ← Back to dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-semibold text-neutral-900">
              Categories
            </h1>

            <p className="mt-1 text-sm text-neutral-600">
              Manage your jewellery categories in English and Arabic.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium hover:bg-neutral-100"
          >
            Manage products
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
          >
            {notice}
          </div>
        )}

        <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            {editingId ? "Edit category" : "Add new category"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="category-en"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Category name (English)
                </label>

                <input
                  id="category-en"
                  required
                  maxLength={100}
                  value={form.en}
                  onChange={(event) => {
                    const value = event.target.value;

                    setForm((current) => ({
                      ...current,
                      en: value,
                      slug: generateSlug(value),
                    }));
                  }}
                  placeholder="e.g. Gold Earrings"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-800"
                />
              </div>

              <div>
                <label
                  htmlFor="category-ar"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Category name (Arabic)
                </label>

                <input
                  id="category-ar"
                  required
                  maxLength={100}
                  dir="rtl"
                  value={form.ar}
                  onChange={(event) => updateField("ar", event.target.value)}
                  placeholder="مثال: أقراط"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-800"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category-slug"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                URL slug
              </label>

              <input
                id="category-slug"
                required
                maxLength={100}
                value={form.slug}
                readOnly
                placeholder="Generated automatically"
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm outline-none"
              />
              <p className="mt-2 text-xs text-neutral-500">
                Automatically generated from the English category name.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || loading}
                className="rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Add category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                All categories
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadCategories()}
              disabled={loading}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              No categories yet. Add your first category above.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                    <th className="px-3 py-4 font-medium">English name</th>
                    <th className="px-3 py-4 font-medium">Arabic name</th>
                    <th className="px-3 py-4 font-medium">Slug</th>
                    <th className="px-3 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                    >
                      <td className="px-3 py-4 font-medium text-neutral-900">
                        {category.name?.en}
                      </td>
                      <td className="px-3 py-4 text-neutral-700" dir="rtl">
                        {category.name?.ar}
                      </td>
                      <td className="px-3 py-4 text-neutral-500">
                        {category.slug}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(category)}
                            disabled={saving || deletingId !== null}
                            className="rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-100 disabled:opacity-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(category)}
                            disabled={deletingId !== null || saving}
                            className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === category._id
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
